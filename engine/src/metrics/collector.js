class MetricsCollector {
    constructor () {
        this.results = [];
    }

    record(result) {
        this.results.push(result);
    }

    gotResults() {
        return this.results;
    }
}

module.exports = MetricsCollector;