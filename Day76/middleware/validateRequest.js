const { body, validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

// ── Reusable validation rules ─────────────────────────────────

exports.validateProduct = [
  body("name")
    .trim()
    .notEmpty().withMessage("Product name is required")
    .isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters"),

  body("price")
    .notEmpty().withMessage("Price is required")
    .isFloat({ min: 0 }).withMessage("Price must be a positive number"),

  body("category")
    .trim()
    .notEmpty().withMessage("Category is required"),

  body("stock")
    .optional()
    .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
];

// ── Middleware to check validation result ─────────────────────

exports.checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(". ");
    return next(new AppError(messages, 400));
  }
  next();
};
