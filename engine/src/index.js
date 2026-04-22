const fs = require("fs");
const path = require("path");
const { runTests } = require("./core/runner");

const testPath = path.join(__dirname, "../../generator/src/output/tests.json");
const tests = JSON.parse(fs.readFileSync(testPath, "utf-8"));

console.log(`Loasded ${tests.length} tests`);

async function main() {
    const testCases = tests;

    const chaosConfig = {
        errorRate: 0.1
    };

    const concurrency = 5;

    const result = await runTests(testCases, {}, 5);

    console.log("Summary:", result.summary);
}
main();