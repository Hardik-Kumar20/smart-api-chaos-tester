const express = require("express");
const app = express();

const testRoutes = require("./routes/test.routes");

app.use(express.json());
app.use("/api/test", testRoutes);


app.post("/users", (req, res) => {
    const { email, age } = req.body;

    if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Invalid email" });
    }

    if (typeof age !== "number") {
        return res.status(400).json({ error: "Invalid age" });
    }

    // simulate XSS vulnerability
    if (email.includes("<script>")) {
        return res.status(200).send(email);
    }

    res.status(200).json({
        message: "User created",
        data: { email, age }
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
});