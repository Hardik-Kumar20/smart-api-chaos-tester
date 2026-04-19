const express = require("express");
const app = express();

const testRoutes = require("./routes/test.routes");

app.use(express.json());
app.use("/api/test", testRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000 🚀");
});