const express = require("express");
const { getAllUnits, getUnitById } = require("../Controllers/storageController");

const router = express.Router();

// Public routes (no auth required)
router.get("/", getAllUnits);
router.get("/:id", getUnitById);

module.exports = router;
