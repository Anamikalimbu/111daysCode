const express = require("express");
const router = express.Router();
const {
  getMyVendorProfile,
  updateMyVendorProfile,
  getVendorStats,
  getVendorStorefront,
} = require("../controllers/vendorController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/me", protect, authorize("vendor"), getMyVendorProfile);
router.put("/me", protect, authorize("vendor"), upload.single("logo"), updateMyVendorProfile);
router.get("/me/stats", protect, authorize("vendor"), getVendorStats);
router.get("/:id", getVendorStorefront);

module.exports = router;
