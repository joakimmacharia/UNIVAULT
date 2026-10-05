const express = require("express");
const { register, login, getMe, logout } = require("../Controllers/authController");
const { protectRoute } = require("../Middleware/authMiddleware");

const router = express.Router();

// Public routes (no auth required)
router.post("/register", register);
router.post("/login", login);

// Protected routes (require valid JWT)
router.get("/me", protectRoute, getMe);
router.post("/logout", protectRoute, logout);

module.exports = router;
