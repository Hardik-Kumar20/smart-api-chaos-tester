const { sendRequest } = require("../transport/httpClient");
const MetricsCollector = require("../metrics/collector");
const { analyze, analyzeSmart } = require("../metrics/analyzer");

const { shouldDelay, applyLatency } = require("../chaos/latency");
const { shouldFail } = require("../chaos/error");
const { shouldDrop } = require("../chaos/drop");

// 🔥 Base URL (change this later or pass from server)
const BASE_URL = "http://localhost:5000";

async function runTests(testCases = [], chaosConfig = {}, concurrency = 5) {
    const collector = new MetricsCollector();

    let index = 0;

    function isTestSuccessful(test, status) {
        if (test.tags?.includes("valid")) {
            return status === 200;
        }
    
        if (test.tags?.includes("invalid")) {
            return status >= 400;
        }
    
        if (test.tags?.includes("boundary")) {
            return status >= 200 && status < 500;
        }
    
        return false;
    }

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
                    url: fullUrl,
                    test: test
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
                    url: fullUrl,
                    test: test
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
                const success = isTestSuccessful(test, result.status);

                collector.record({
                    ...result,
                    success,
                    url: fullUrl,
                    test: test
                });

            } catch (err) {
                collector.record({
                    success: false,
                    status: 500,
                    latency: 0,
                    error: err.message,
                    url: fullUrl,
                    test: test
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
    analyzeSmart(results);

    return {
        results,
        summary
    };
}

module.exports = { runTests };