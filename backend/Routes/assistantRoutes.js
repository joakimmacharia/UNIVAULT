const express = require("express");
const { chat } = require("../Controllers/assistantController");

const router = express.Router();

// Public — David is available to visitors and logged-in users alike.
router.post("/chat", chat);

module.exports = router;
