const express = require("express");
const {
  getAllUnits,
  getUnitById,
  createUnit,
  getMyUnits,
  deleteUnit,
} = require("../Controllers/storageController");
const { protectRoute } = require("../Middleware/authMiddleware");

const router = express.Router();

// Public routes (no auth required)
router.get("/", getAllUnits);

// Protected landlord routes — declared before "/:id" so "/mine"
// isn't captured by the dynamic id param.
router.get("/mine", protectRoute, getMyUnits);
router.post("/", protectRoute, createUnit);
router.delete("/:id", protectRoute, deleteUnit);

router.get("/:id", getUnitById);

module.exports = router;
