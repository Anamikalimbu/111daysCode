const express = require("express");
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  updateOrderItemStatus,
  getAllOrders,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/vendor/mine", authorize("vendor"), getVendorOrders);
router.get("/", authorize("admin"), getAllOrders);
router.get("/:id", getOrderById);
router.put("/:orderId/items/:itemId/status", authorize("vendor", "admin"), updateOrderItemStatus);

module.exports = router;
