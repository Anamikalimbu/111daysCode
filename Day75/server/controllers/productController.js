const Product = require('../models/Product');

// GET /api/products?search=&category=&stock=&sort=added&order=desc&page=1&limit=8
exports.getProducts = async (req, res) => {
  try {
    const { search = '', category = '', stock = '', sort = 'added', order = 'desc', page = 1, limit = 8 } = req.query;

    const query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
    if (category) query.category = category;
    if (stock) query.stock = stock;

    const sortDir = order === 'asc' ? 1 : -1;
    const sortObj = { [sort]: sortDir };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj).skip(skip).limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.seedProducts = async (req, res) => {
  try {
    const data = [
      { name: "Wireless Headphones", category: "Tech", price: 89.99, stock: "In Stock", qty: 142, rating: 4.5, sold: 1230, added: "2024-01-10" },
      { name: "Running Shoes", category: "Sports", price: 129.99, stock: "In Stock", qty: 87, rating: 4.7, sold: 980, added: "2024-02-14" },
      { name: "Organic Green Tea", category: "Food", price: 12.49, stock: "In Stock", qty: 310, rating: 4.3, sold: 2100, added: "2023-11-05" },
      { name: "JavaScript: The Good Parts", category: "Books", price: 34.99, stock: "In Stock", qty: 55, rating: 4.8, sold: 670, added: "2023-09-20" },
      { name: "Yoga Mat", category: "Sports", price: 45.00, stock: "Low Stock", qty: 8, rating: 4.2, sold: 430, added: "2024-03-01" },
      { name: "Smart Watch", category: "Tech", price: 249.99, stock: "In Stock", qty: 63, rating: 4.6, sold: 510, added: "2024-01-22" },
      { name: "Linen Shirt", category: "Clothing", price: 59.99, stock: "Out of Stock", qty: 0, rating: 4.0, sold: 290, added: "2024-02-08" },
      { name: "Standing Desk", category: "Home", price: 399.00, stock: "In Stock", qty: 22, rating: 4.4, sold: 115, added: "2023-12-12" },
      { name: "Bluetooth Speaker", category: "Tech", price: 79.99, stock: "Low Stock", qty: 5, rating: 4.3, sold: 760, added: "2024-04-03" },
      { name: "Cookbooks Bundle", category: "Books", price: 49.99, stock: "In Stock", qty: 40, rating: 4.6, sold: 330, added: "2024-01-30" },
      { name: "Trail Mix (1kg)", category: "Food", price: 8.99, stock: "In Stock", qty: 500, rating: 4.1, sold: 3400, added: "2023-10-18" },
      { name: "Denim Jacket", category: "Clothing", price: 89.00, stock: "In Stock", qty: 34, rating: 4.5, sold: 520, added: "2024-03-15" },
      { name: "Mechanical Keyboard", category: "Tech", price: 139.99, stock: "In Stock", qty: 77, rating: 4.7, sold: 890, added: "2023-12-05" },
      { name: "Air Fryer", category: "Home", price: 89.99, stock: "In Stock", qty: 48, rating: 4.6, sold: 740, added: "2024-02-22" },
      { name: "Resistance Bands Set", category: "Sports", price: 24.99, stock: "In Stock", qty: 200, rating: 4.2, sold: 1100, added: "2024-01-05" },
      { name: "Python Crash Course", category: "Books", price: 39.99, stock: "Low Stock", qty: 7, rating: 4.9, sold: 440, added: "2023-08-14" },
      { name: "Cold Brew Coffee", category: "Food", price: 18.00, stock: "Out of Stock", qty: 0, rating: 4.4, sold: 820, added: "2024-03-28" },
      { name: "Hoodie — Navy", category: "Clothing", price: 64.99, stock: "In Stock", qty: 95, rating: 4.3, sold: 610, added: "2024-04-10" },
      { name: "Desk Lamp", category: "Home", price: 49.00, stock: "In Stock", qty: 66, rating: 4.1, sold: 320, added: "2024-02-01" },
      { name: "Protein Powder 2kg", category: "Food", price: 54.99, stock: "In Stock", qty: 130, rating: 4.5, sold: 970, added: "2024-01-18" },
      { name: "USB-C Hub 7-in-1", category: "Tech", price: 59.99, stock: "In Stock", qty: 44, rating: 4.4, sold: 620, added: "2024-03-10" },
      { name: "Bamboo Cutting Board", category: "Home", price: 29.99, stock: "Low Stock", qty: 9, rating: 4.2, sold: 270, added: "2024-02-16" },
      { name: "Design Patterns Book", category: "Books", price: 55.00, stock: "In Stock", qty: 28, rating: 4.7, sold: 380, added: "2023-11-20" },
      { name: "Tennis Racket", category: "Sports", price: 79.00, stock: "Out of Stock", qty: 0, rating: 4.3, sold: 190, added: "2023-10-05" },
      { name: "Scarf — Merino Wool", category: "Clothing", price: 44.99, stock: "In Stock", qty: 72, rating: 4.6, sold: 210, added: "2024-04-15" }
    ];
    await Product.deleteMany({});
    await Product.insertMany(data);
    res.json({ message: `Seeded ${data.length} products` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
