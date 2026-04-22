function percentile(arr, p){
    if (arr.length === 0) return 0;

    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;

    return sorted[index];
}




function analyze( results ) {
    const total = results.length;

    const successResults = results.filter(r => r.success);
    const failureResults = results.filter(r => !r.success);

    const latencies = successResults.map(r => r.latency);

    const avgLatency = latencies.reduce((sum, val) => sum + val, 0) / (latencies.length || 1);

    const p95 = percentile(latencies, 95);
    const p99 = percentile(latencies, 99);

    return {
        total,
        successCount: successResults.length,
        failureCount: failureResults.length,
        successRate: (successResults.length / total) * 100,
        avgLatency,
        p95Latency: p95,
        p99Latency: p99
    }
}


function analyzeSmart(results) {
    for (const r of results) {
        const test = r.test || {};

        if (test.tags?.includes("valid") && r.status !== 200) {
            console.log("❌ Valid test failed:", test);
        }

        if (test.tags?.includes("invalid") && r.status < 400) {
            console.log("❌ Invalid test passed:", test);
        }

        if (test.tags?.includes("xss") && typeof r.data === "string" && r.data.includes("<script>")) {
            console.log("🚨 XSS vulnerability detected!");
        }
    }
}
module.exports = { analyze,
        analyzeSmart
 };