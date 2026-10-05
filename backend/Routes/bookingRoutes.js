const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require("../Controllers/bookingController");
const { protectRoute } = require("../Middleware/authMiddleware");

const router = express.Router();

// All booking routes are protected (require valid JWT)
router.post("/", protectRoute, createBooking);
router.get("/me", protectRoute, getMyBookings);
router.get("/:id", protectRoute, getBookingById);
router.patch("/:id/cancel", protectRoute, cancelBooking);

module.exports = router;
