const Product = require("../models/Product");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/AppError");
const asyncHandler = require("../middleware/asyncHandler");

// ── Helper: standard success response ────────────────────────

const sendSuccess = (res, statusCode, message, data = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

// ── GET /api/v1/products ──────────────────────────────────────
// Supports: ?search=laptop&category=electronics&price[gte]=500
//           &sort=-price&page=1&limit=5&fields=name,price,category

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  // Count total matching docs (before pagination) for meta
  const countFeatures = new APIFeatures(Product.find({ isActive: true }), req.query)
    .search()
    .filter();
  const totalCount = await Product.countDocuments(
    countFeatures.query.getFilter()
  );

  // Apply all features including pagination
  const features = new APIFeatures(Product.find({ isActive: true }), req.query)
    .search()
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const products = await features.query;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const totalPages = Math.ceil(totalCount / limit);

  sendSuccess(res, 200, "Products fetched successfully", {
    count: products.length,
    totalCount,
    pagination: {
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    data: { products },
  });
});

// ── GET /api/v1/products/:id ──────────────────────────────────

exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    return next(new AppError("Product not found", 404));
  }

  sendSuccess(res, 200, "Product fetched successfully", {
    data: { product },
  });
});

// ── POST /api/v1/products ─────────────────────────────────────

exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, stock } = req.body;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
  });

  sendSuccess(res, 201, "Product created successfully", {
    data: { product },
  });
});

// ── PUT /api/v1/products/:id ──────────────────────────────────

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    return next(new AppError("Product not found", 404));
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,           // return updated doc
      runValidators: true, // run schema validators on update
    }
  );

  sendSuccess(res, 200, "Product updated successfully", {
    data: { product: updatedProduct },
  });
});

// ── DELETE /api/v1/products/:id (soft delete) ─────────────────

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    return next(new AppError("Product not found", 404));
  }

  // Soft delete: set isActive = false instead of removing from DB
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });

  sendSuccess(res, 200, "Product deleted successfully", {
    data: null,
  });
});

// ── GET /api/v1/products/stats ────────────────────────────────
// Aggregation pipeline example

exports.getProductStats = asyncHandler(async (req, res, next) => {
  const stats = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: "$category",
        totalProducts: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        totalStock: { $sum: "$stock" },
      },
    },
    { $sort: { avgPrice: -1 } },
  ]);

  sendSuccess(res, 200, "Product stats fetched", {
    count: stats.length,
    data: { stats },
  });
});
