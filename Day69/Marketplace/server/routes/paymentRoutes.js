const express = require("express");
const router = express.Router();
const { verifyKhaltiPayment, verifyEsewaPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/khalti/verify", verifyKhaltiPayment);
router.post("/esewa/verify", verifyEsewaPayment);

module.exports = router;
