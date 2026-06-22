const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };

  if (keyword) {
    query.$text = { $search: keyword };
  }
  if (category) {
    query.category = category;
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "rating") sortOption = { ratings: -1 };

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate("vendor", "storeName")
    .sort(sortOption)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("vendor", "storeName storeLogo");
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.json({ success: true, product });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) {
    throw new ApiError(403, "Vendor profile not found for this user");
  }
  if (vendor.status !== "approved") {
    throw new ApiError(403, "Your vendor account is not yet approved");
  }

  const { name, description, price, discountPrice, category, stock } = req.body;

  const images = (req.files || []).map((file) => ({
    url: file.path,
    public_id: file.filename,
  }));

  const product = await Product.create({
    vendor: vendor._id,
    name,
    description,
    price,
    discountPrice,
    category,
    stock,
    images,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Vendor (owner only)
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
    if (req.user.role !== "admin") {
      throw new ApiError(403, "Not authorized to update this product");
    }
  }

  const fields = ["name", "description", "price", "discountPrice", "category", "stock", "isActive"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({ url: file.path, public_id: file.filename }));
    product.images.push(...newImages);
  }

  await product.save();
  res.json({ success: true, product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Vendor (owner only) or Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const vendor = await Vendor.findOne({ user: req.user._id });
  if ((!vendor || product.vendor.toString() !== vendor._id.toString()) && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to delete this product");
  }

  await product.deleteOne();
  res.json({ success: true, message: "Product deleted" });
});

// @desc    Get all products belonging to logged-in vendor
// @route   GET /api/products/vendor/mine
// @access  Private/Vendor
const getMyVendorProducts = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) {
    throw new ApiError(403, "Vendor profile not found");
  }
  const products = await Product.find({ vendor: vendor._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, products });
});

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.ratings =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: "Review added" });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyVendorProducts,
  addProductReview,
};
