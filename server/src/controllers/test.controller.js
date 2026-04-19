const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const { runTests } = require("../../../engine/src/core/runner");

exports.runTest = async (req, res) => {
    try {
        // 1️⃣ Run Python generator
        const generatorPath = path.join(__dirname, "../../../generator/src/main.py");

        await new Promise((resolve, reject) => {
            exec(`python3 ${generatorPath}`, (err, stdout, stderr) => {
                if (err) return reject(err);
                console.log(stdout);
                resolve();
            });
        });

        // 2️⃣ Load generated test cases
        const testFile = path.join(
            __dirname,
            "../../../generator/src/output/tests.json"
        );

        const rawData = fs.readFileSync(testFile);
        const testCases = JSON.parse(rawData);

        // 3️⃣ Run engine
        const result = await runTests(testCases, 5);

        // 4️⃣ Send result to frontend
        res.json(result);

    } catch (error) {
        console.error("FULL ERROR:", error); // 👈 important
        res.status(500).json({ error: error.message });
    }
};