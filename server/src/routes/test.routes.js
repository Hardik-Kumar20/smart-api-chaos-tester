const express = require("express");
const router = express.Router();
const { runTest } = require("../controllers/test.controller");

router.post("/run", runTest);

module.exports = router;