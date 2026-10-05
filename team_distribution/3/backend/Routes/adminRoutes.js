const express = require("express");
const router = express.Router();

const { protectRoute } = require("../Middleware/authMiddleware");
const { adminOnly } = require("../Middleware/adminMiddleware");
const {
  getDashboardStats,
  getAllBookings,
  getAllUsers,
  getAllUnitsAdmin,
  updateBookingStatus,
} = require("../Controllers/adminController");

// All admin routes require authentication + admin role
router.use(protectRoute, adminOnly);

// GET /api/admin/stats — Dashboard statistics
router.get("/stats", getDashboardStats);

// GET /api/admin/bookings — All bookings in the system
router.get("/bookings", getAllBookings);

// GET /api/admin/users — All registered users
router.get("/users", getAllUsers);

// GET /api/admin/units — All storage units
router.get("/units", getAllUnitsAdmin);

// PATCH /api/admin/bookings/:id/status — Override booking status
router.patch("/bookings/:id/status", updateBookingStatus);

module.exports = router;
