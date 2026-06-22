const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyVendorProducts,
  addProductReview,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/", getProducts);
router.get("/vendor/mine", protect, authorize("vendor"), getMyVendorProducts);
router.get("/:id", getProductById);

router.post("/", protect, authorize("vendor"), upload.array("images", 5), createProduct);
router.put("/:id", protect, authorize("vendor", "admin"), upload.array("images", 5), updateProduct);
router.delete("/:id", protect, authorize("vendor", "admin"), deleteProduct);

router.post("/:id/reviews", protect, addProductReview);

module.exports = router;
