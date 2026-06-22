const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

// GET /api/cart - Get user's cart
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) return res.json({ items: [], totalPrice: 0 });

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );
    res.json({ items: cart.items, totalPrice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart - Add item to cart
router.post("/", protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.stock < quantity) return res.status(400).json({ message: "Insufficient stock" });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate("items.product");

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );
    res.json({ items: cart.items, totalPrice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/cart/:productId - Update item quantity
router.put("/:productId", protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === req.params.productId
    );
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== req.params.productId
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );
    res.json({ items: cart.items, totalPrice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/:productId - Remove item from cart
router.delete("/:productId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate("items.product");

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity, 0
    );
    res.json({ items: cart.items, totalPrice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart - Clear cart
router.delete("/", protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ message: "Cart cleared", items: [], totalPrice: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
