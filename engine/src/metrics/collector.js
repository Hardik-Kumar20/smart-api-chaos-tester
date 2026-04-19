class MetricsCollector {
    constructor() {
        this.results = [];
    }

    record(result) {
        this.results.push(result);
    }

    getResults() {   // ✅ correct name
        return this.results;
    }
}

module.exports = MetricsCollector;