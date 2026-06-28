const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require("../controllers/productController");

const {
  validateProduct,
  checkValidation,
} = require("../middleware/validateRequest");

// ── Stats route (must be before /:id to avoid conflict) ───────
router.get("/stats", getProductStats);

// ── Collection routes ─────────────────────────────────────────
router
  .route("/")
  .get(getAllProducts)
  .post(validateProduct, checkValidation, createProduct);

// ── Single resource routes ────────────────────────────────────
router
  .route("/:id")
  .get(getProductById)
  .put(validateProduct, checkValidation, updateProduct)
  .delete(deleteProduct);

module.exports = router;
