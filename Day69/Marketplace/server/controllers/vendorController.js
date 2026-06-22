const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get logged-in vendor's store profile
// @route   GET /api/vendors/me
// @access  Private/Vendor
const getMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id }).populate("user", "name email");
  if (!vendor) {
    throw new ApiError(404, "Vendor profile not found");
  }
  res.json({ success: true, vendor });
});

// @desc    Update vendor store profile
// @route   PUT /api/vendors/me
// @access  Private/Vendor
const updateMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) {
    throw new ApiError(404, "Vendor profile not found");
  }

  const fields = ["storeName", "storeDescription", "bankDetails"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) vendor[field] = req.body[field];
  });

  if (req.file) {
    vendor.storeLogo = req.file.path;
  }

  await vendor.save();
  res.json({ success: true, vendor });
});

// @desc    Get vendor dashboard stats (sales, orders, products)
// @route   GET /api/vendors/me/stats
// @access  Private/Vendor
const getVendorStats = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) {
    throw new ApiError(404, "Vendor profile not found");
  }

  const totalProducts = await Product.countDocuments({ vendor: vendor._id });

  const orders = await Order.find({ "items.vendor": vendor._id });
  let totalSales = 0;
  let totalOrders = 0;

  orders.forEach((order) => {
    const vendorItems = order.items.filter((i) => i.vendor.toString() === vendor._id.toString());
    if (vendorItems.length > 0) {
      totalOrders += 1;
      totalSales += vendorItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    }
  });

  res.json({
    success: true,
    stats: { totalProducts, totalOrders, totalSales, storeStatus: vendor.status },
  });
});

// @desc    Get public vendor storefront by ID
// @route   GET /api/vendors/:id
// @access  Public
const getVendorStorefront = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor || vendor.status !== "approved") {
    throw new ApiError(404, "Vendor store not found");
  }
  const products = await Product.find({ vendor: vendor._id, isActive: true });
  res.json({ success: true, vendor, products });
});

module.exports = {
  getMyVendorProfile,
  updateMyVendorProfile,
  getVendorStats,
  getVendorStorefront,
};
