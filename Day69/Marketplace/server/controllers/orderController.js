const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");

// @desc    Create new order from cart (checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  // Verify stock for every item before creating order
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${item.name}`);
    }
  }

  const itemsPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 100; // flat shipping rule example
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items: cart.items.map((item) => ({
      product: item.product,
      vendor: item.vendor,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    isPaid: paymentMethod === "cod" ? false : false, // becomes true after payment verification
  });

  // Decrement stock for each ordered product
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  // Clear the cart after order is placed
  cart.items = [];
  await cart.save();

  res.status(201).json({ success: true, order });
});

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    // Allow vendor to view if order contains their items
    const vendor = await Vendor.findOne({ user: req.user._id });
    const hasVendorItems = vendor && order.items.some((i) => i.vendor.toString() === vendor._id.toString());
    if (!hasVendorItems) {
      throw new ApiError(403, "Not authorized to view this order");
    }
  }

  res.json({ success: true, order });
});

// @desc    Get orders containing logged-in vendor's products
// @route   GET /api/orders/vendor/mine
// @access  Private/Vendor
const getVendorOrders = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) {
    throw new ApiError(403, "Vendor profile not found");
  }

  const orders = await Order.find({ "items.vendor": vendor._id }).sort({ createdAt: -1 });

  // Return only the vendor's own items within each order
  const vendorOrders = orders.map((order) => ({
    _id: order._id,
    user: order.user,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt,
    items: order.items.filter((item) => item.vendor.toString() === vendor._id.toString()),
  }));

  res.json({ success: true, count: vendorOrders.length, orders: vendorOrders });
});

// @desc    Update status of a specific item within an order (vendor updates their own item)
// @route   PUT /api/orders/:orderId/items/:itemId/status
// @access  Private/Vendor
const updateOrderItemStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const item = order.items.id(req.params.itemId);
  if (!item) {
    throw new ApiError(404, "Order item not found");
  }

  const vendor = await Vendor.findOne({ user: req.user._id });
  if (req.user.role !== "admin" && (!vendor || item.vendor.toString() !== vendor._id.toString())) {
    throw new ApiError(403, "Not authorized to update this item");
  }

  item.status = status;

  if (order.items.every((i) => i.status === "delivered")) {
    order.isDelivered = true;
  }

  await order.save();
  res.json({ success: true, order });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  updateOrderItemStatus,
  getAllOrders,
};
