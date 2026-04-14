const { runTests } = require("./core/runner");

async function main() {
    const testCases = Array(50).fill({
        method: "GET",
        url: "https://jsonplaceholder.typicode.com/posts/1"
    })

    const result = await runTests(testCases, 5);

    console.log("Summary:", result.summary);
}
main();