const { sendRequest } = require("../transport/httpClient");
const MetricsCollector = require("../metrics/collector");
const { analyze } = require("../metrics/analyzer");

const { shouldDelay, applyLatency } = require("../chaos/latency");
const { shouldFail } = require("../chaos/error");
const { shouldDrop } = require("../chaos/drop");

// 🔥 Base URL (change this later or pass from server)
const BASE_URL = "https://jsonplaceholder.typicode.com";

async function runTests(testCases = [], chaosConfig = {}, concurrency = 5) {
    const collector = new MetricsCollector();

    let index = 0;

    async function worker() {
        while (index < testCases.length) {
            const currentIndex = index++;
            const test = testCases[currentIndex];

            // 🔗 Ensure absolute URL
            const fullUrl = test.url.startsWith("http")
                ? test.url
                : BASE_URL + test.url;

                console.log("Running:", test.method, fullUrl);

            // 💀 CHAOS START

            // Drop request
            if (shouldDrop(0.05)) {
                collector.record({
                    success: false,
                    status: 0,
                    latency: 0,
                    error: "Request Dropped",
                    url: fullUrl
                });
                continue;
            }

            // Add artificial delay
            if (shouldDelay(0.12)) {
                await applyLatency(200, 1000);
            }

            // Inject error
            if (shouldFail(chaosConfig.errorRate || 0.1)) {
                collector.record({
                    success: false,
                    status: 500,
                    latency: 0,
                    error: "Injected Error",
                    url: fullUrl
                });
                continue;
            }

            // 💀 CHAOS END

            try {
                const isGet = test.method.toUpperCase() === "GET";

                const result = await sendRequest({
                    method: test.method,
                    url: fullUrl,
                    headers: test.headers,
                    data: isGet ? undefined : (test.payload || test.body),
                    timeout: test.timeout
                });

                collector.record({
                    ...result,
                    url: fullUrl
                });

            } catch (err) {
                collector.record({
                    success: false,
                    status: 500,
                    latency: 0,
                    error: err.message,
                    url: fullUrl
                });
            }
        }
    }

    // 🧵 Create workers
    const workers = [];
    for (let i = 0; i < concurrency; i++) {
        workers.push(worker());
    }

    await Promise.all(workers);

    const results = collector.getResults(); // ✅ FIXED
    const summary = analyze(results);

    return {
        results,
        summary
    };
}

module.exports = { runTests };