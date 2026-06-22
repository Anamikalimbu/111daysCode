const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Vendor = require("../models/Vendor");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get all vendors (for admin approval workflow)
// @route   GET /api/admin/vendors
// @access  Private/Admin
const getAllVendors = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const vendors = await Vendor.find(query).populate("user", "name email");
  res.json({ success: true, count: vendors.length, vendors });
});

// @desc    Approve or suspend a vendor
// @route   PUT /api/admin/vendors/:id/status
// @access  Private/Admin
const updateVendorStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["pending", "approved", "suspended"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  vendor.status = status;
  await vendor.save();

  res.json({ success: true, vendor });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, count: users.length, users });
});

// @desc    Get overall platform stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalVendors = await Vendor.countDocuments();
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();

  const orders = await Order.find();
  const totalRevenue = orders.reduce((acc, o) => acc + (o.isPaid ? o.totalPrice : 0), 0);

  res.json({
    success: true,
    stats: { totalUsers, totalVendors, totalProducts, totalOrders, totalRevenue },
  });
});

module.exports = { getAllVendors, updateVendorStatus, getAllUsers, getPlatformStats };
