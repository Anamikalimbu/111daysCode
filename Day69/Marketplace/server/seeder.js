require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

const User = require("./models/User");
const Vendor = require("./models/Vendor");
const Product = require("./models/Product");

const seed = async () => {
  await connectDB();

  // Clear existing data
  console.log("🗑️  Clearing existing data...");
  await Product.deleteMany();
  await Vendor.deleteMany();
  await User.deleteMany();

  // ─── Create Admin ───────────────────────────────────────────────
  console.log("👤 Creating admin...");
  const adminUser = await User.create({
    name: "Admin",
    email: "admin@marketplace.com",
    password: "admin123",
    role: "admin",
  });

  // ─── Create Vendors ──────────────────────────────────────────────
  console.log("🏪 Creating vendors...");

  const vendorData = [
    { name: "Ram Electronics", email: "ram@vendor.com", storeName: "Ram Electronics", storeDescription: "Best electronics in town" },
    { name: "Sita Fashion", email: "sita@vendor.com", storeName: "Sita Fashion Hub", storeDescription: "Trendy clothes at great prices" },
    { name: "Krishna Kitchen", email: "krishna@vendor.com", storeName: "Krishna Kitchen Store", storeDescription: "Quality kitchen & home goods" },
  ];

  const createdVendors = [];

  for (const vd of vendorData) {
    const user = await User.create({
      name: vd.name,
      email: vd.email,
      password: "vendor123",
      role: "vendor",
    });

    const vendor = await Vendor.create({
      user: user._id,
      storeName: vd.storeName,
      storeDescription: vd.storeDescription,
      status: "approved",
    });

    user.vendorProfile = vendor._id;
    await user.save();

    createdVendors.push(vendor);
  }

  const [electronics, fashion, kitchen] = createdVendors;

  // ─── Create Products ─────────────────────────────────────────────
  console.log("📦 Creating products...");

  const products = [
    // Electronics
    {
      vendor: electronics._id,
      name: "Wireless Bluetooth Earbuds",
      description: "High-quality wireless earbuds with noise cancellation and 24-hour battery life. Compatible with all Bluetooth devices.",
      price: 3500,
      discountPrice: 2999,
      category: "Electronics",
      stock: 50,
      ratings: 4.5,
      numReviews: 12,
      images: [{ url: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500", public_id: "seed_1" }],
    },
    {
      vendor: electronics._id,
      name: "USB-C Fast Charger 65W",
      description: "65W GaN fast charger with USB-C and USB-A ports. Charges laptops, phones, and tablets simultaneously.",
      price: 1800,
      discountPrice: 1499,
      category: "Electronics",
      stock: 80,
      ratings: 4.3,
      numReviews: 8,
      images: [{ url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500", public_id: "seed_2" }],
    },
    {
      vendor: electronics._id,
      name: "Mechanical Keyboard TKL",
      description: "Tenkeyless mechanical keyboard with RGB backlight and blue switches. Perfect for typing and gaming.",
      price: 5500,
      category: "Electronics",
      stock: 25,
      ratings: 4.7,
      numReviews: 20,
      images: [{ url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500", public_id: "seed_3" }],
    },
    {
      vendor: electronics._id,
      name: "Portable Power Bank 20000mAh",
      description: "Slim 20000mAh power bank with dual USB output and LED indicator. Charges your phone 5+ times.",
      price: 2200,
      discountPrice: 1899,
      category: "Electronics",
      stock: 60,
      ratings: 4.2,
      numReviews: 15,
      images: [{ url: "https://images.unsplash.com/photo-1609592806596-b8b7b9c5b9b1?w=500", public_id: "seed_4" }],
    },

    // Fashion
    {
      vendor: fashion._id,
      name: "Men's Casual Cotton T-Shirt",
      description: "Comfortable 100% cotton t-shirt available in multiple colors. Perfect for everyday wear.",
      price: 599,
      discountPrice: 499,
      category: "Fashion",
      stock: 120,
      ratings: 4.1,
      numReviews: 30,
      images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", public_id: "seed_5" }],
    },
    {
      vendor: fashion._id,
      name: "Women's Kurta Set",
      description: "Elegant traditional kurta with matching dupatta. Made from soft cotton fabric with embroidery detailing.",
      price: 1899,
      discountPrice: 1599,
      category: "Fashion",
      stock: 40,
      ratings: 4.6,
      numReviews: 18,
      images: [{ url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500", public_id: "seed_6" }],
    },
    {
      vendor: fashion._id,
      name: "Unisex Running Sneakers",
      description: "Lightweight breathable sneakers with cushioned sole. Great for running, gym, and casual use.",
      price: 3200,
      discountPrice: 2799,
      category: "Fashion",
      stock: 35,
      ratings: 4.4,
      numReviews: 22,
      images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", public_id: "seed_7" }],
    },
    {
      vendor: fashion._id,
      name: "Leather Wallet for Men",
      description: "Genuine leather bifold wallet with 6 card slots, coin pocket, and RFID blocking technology.",
      price: 1200,
      discountPrice: 999,
      category: "Fashion",
      stock: 75,
      ratings: 4.3,
      numReviews: 11,
      images: [{ url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500", public_id: "seed_8" }],
    },

    // Kitchen
    {
      vendor: kitchen._id,
      name: "Stainless Steel Water Bottle 1L",
      description: "Double-wall insulated water bottle. Keeps drinks cold 24 hours and hot 12 hours. BPA free.",
      price: 899,
      discountPrice: 749,
      category: "Kitchen",
      stock: 100,
      ratings: 4.8,
      numReviews: 45,
      images: [{ url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500", public_id: "seed_9" }],
    },
    {
      vendor: kitchen._id,
      name: "Non-Stick Frying Pan Set (3pcs)",
      description: "3-piece non-stick frying pan set (20cm, 24cm, 28cm) with heat-resistant handles. Dishwasher safe.",
      price: 2500,
      discountPrice: 1999,
      category: "Kitchen",
      stock: 30,
      ratings: 4.5,
      numReviews: 28,
      images: [{ url: "https://images.unsplash.com/photo-1584786379560-c84e2aeb8eae?w=500", public_id: "seed_10" }],
    },
    {
      vendor: kitchen._id,
      name: "Electric Rice Cooker 1.8L",
      description: "1.8L automatic rice cooker with steam tray, keep-warm function, and non-stick inner pot.",
      price: 3200,
      discountPrice: 2799,
      category: "Kitchen",
      stock: 20,
      ratings: 4.6,
      numReviews: 16,
      images: [{ url: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500", public_id: "seed_11" }],
    },
    {
      vendor: kitchen._id,
      name: "Bamboo Cutting Board Set",
      description: "Set of 3 bamboo cutting boards in different sizes. Eco-friendly, antibacterial, and knife-friendly.",
      price: 799,
      discountPrice: 649,
      category: "Kitchen",
      stock: 60,
      ratings: 4.2,
      numReviews: 9,
      images: [{ url: "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?w=500", public_id: "seed_12" }],
    },
  ];

  await Product.insertMany(products);

  console.log("\n✅ Seed complete!\n");
  console.log("─────────────────────────────────────");
  console.log("🔑  Login credentials:");
  console.log("");
  console.log("  ADMIN");
  console.log("  Email   : admin@marketplace.com");
  console.log("  Password: admin123");
  console.log("");
  console.log("  VENDORS (all password: vendor123)");
  vendorData.forEach((v) => console.log(`  ${v.storeName.padEnd(25)} ${v.email}`));
  console.log("");
  console.log("  Register a customer account from the website.");
  console.log("─────────────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
