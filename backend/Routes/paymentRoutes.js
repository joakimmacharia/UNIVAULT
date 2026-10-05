const express = require("express");
const router = express.Router();
const { initiateSTKPush, darajaCallback } = require("../Controllers/paymentController");

// Route to initiate payment
router.post("/stkpush", initiateSTKPush);

// Route for Daraja webhook callback
router.post("/callback", darajaCallback);

module.exports = router;
