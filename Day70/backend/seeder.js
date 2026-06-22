/**
 * Seed script — run this directly if the UI seed button doesn't work
 * Usage: node seeder.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/Product");

const sampleProducts = [
  { name: "Fresh Apples", description: "Crisp red apples from Himachal Pradesh", price: 120, category: "Fruits", stock: 50, rating: 4.5, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300" },
  { name: "Bananas", description: "Sweet ripe bananas, dozen pack", price: 60, category: "Fruits", stock: 80, rating: 4.2, image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300" },
  { name: "Tomatoes (1kg)", description: "Fresh local tomatoes", price: 45, category: "Vegetables", stock: 100, rating: 4.0, image: "https://images.unsplash.com/photo-1546470427-227c4d84da75?w=300" },
  { name: "Spinach Bundle", description: "Fresh green spinach", price: 30, category: "Vegetables", stock: 40, rating: 4.3, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300" },
  { name: "Full Cream Milk (1L)", description: "Fresh pasteurized milk", price: 85, category: "Dairy", stock: 60, rating: 4.6, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300" },
  { name: "Paneer (200g)", description: "Fresh homemade style paneer", price: 90, category: "Dairy", stock: 30, rating: 4.4, image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300" },
  { name: "Whole Wheat Bread", description: "Soft multigrain loaf", price: 55, category: "Bakery", stock: 25, rating: 4.1, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300" },
  { name: "Mango Juice (1L)", description: "100% pure mango juice", price: 110, category: "Beverages", stock: 45, rating: 4.7, image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=300" },
  { name: "Lays Classic (100g)", description: "Crunchy salted potato chips", price: 40, category: "Snacks", stock: 200, rating: 4.5, image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300" },
  { name: "Almonds (250g)", description: "Premium California almonds", price: 280, category: "Snacks", stock: 35, rating: 4.8, image: "https://images.unsplash.com/photo-1574570069015-7b406415d3c4?w=300" },
  { name: "Orange (6 pcs)", description: "Juicy navel oranges", price: 95, category: "Fruits", stock: 70, rating: 4.3, image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=300" },
  { name: "Curd (400g)", description: "Thick set homestyle curd", price: 50, category: "Dairy", stock: 55, rating: 4.2, image: "https://images.unsplash.com/photo-1584278858578-a7b4e15eb2cd?w=300" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Product.deleteMany({});
    console.log("🗑  Cleared existing products");

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`🌱 Seeded ${inserted.length} products successfully!`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
