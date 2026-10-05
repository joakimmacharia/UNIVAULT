const express = require("express");
const router = express.Router();
const { getConversations, getMessages, sendMessage, getUsers } = require("../Controllers/messageController");
const { protectRoute } = require("../Middleware/authMiddleware");

router.use(protectRoute);

router.get("/users", getUsers);
router.get("/", getConversations);
router.get("/:id", getMessages);
router.post("/", sendMessage);

module.exports = router;
