// Run this script using: node --env-file=.env.local seed/seed.db.js
// If you encounter ES module errors, you may need to temporarily set "type": "module" in package.json
// or rename this file to seed.db.mjs

import mongoose from "mongoose";
import bcrypt from "bcrypt";

// .env variables are automatically loaded by node --env-file=.env.local

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable inside .env.local");
  process.exit(1);
}

// 1. Re-define minimal schemas to avoid import issues with Next.js specific syntax
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }]
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  category: { type: String, required: true },
  stockCount: { type: Number, required: true, default: 0 },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
}, { timestamps: true });

const User = mongoose.models.user || mongoose.model("user", userSchema);
const Product = mongoose.models.product || mongoose.model("product", productSchema);

// 2. Dummy Data
const dummyProducts = [
  {
    name: "MacBook Pro 16-inch",
    description: "Apple M3 Max chip with 16‑core CPU, 40‑core GPU, 48GB Unified Memory, 1TB SSD Storage.",
    price: 3499.00,
    category: "Laptops",
    stockCount: 15,
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.8, count: 124 }
  },
  {
    name: "Dell XPS 15",
    description: "13th Gen Intel Core i7, 32GB RAM, 1TB SSD, NVIDIA RTX 4070, 15.6-inch OLED touch display.",
    price: 2299.99,
    category: "Laptops",
    stockCount: 8,
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.5, count: 89 }
  },
  {
    name: "iPhone 15 Pro",
    description: "A17 Pro chip, Titanium design, 48MP Main camera, 256GB storage.",
    price: 1099.00,
    category: "Smartphones",
    stockCount: 50,
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.9, count: 340 }
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Snapdragon 8 Gen 3, 200MP camera, Titanium frame, AI features.",
    price: 1299.99,
    category: "Smartphones",
    stockCount: 40,
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.7, count: 210 }
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry Leading Noise Canceling Wireless Headphones with Auto Noise Canceling Optimizer.",
    price: 398.00,
    category: "Audio",
    stockCount: 120,
    images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.6, count: 532 }
  },
  {
    name: "AirPods Pro (2nd Gen)",
    description: "Active Noise Cancellation, Adaptive Audio, Transparency mode, USB-C.",
    price: 249.00,
    category: "Audio",
    stockCount: 200,
    images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.8, count: 890 }
  },
  {
    name: "Keychron Q1 Pro",
    description: "QMK/VIA Wireless Custom Mechanical Keyboard, 75% Layout, Aluminum Body.",
    price: 199.00,
    category: "Accessories",
    stockCount: 30,
    images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.7, count: 145 }
  },
  {
    name: "Logitech MX Master 3S",
    description: "Wireless Performance Mouse, 8K DPI Track-on-Glass Sensor, Quiet Clicks.",
    price: 99.99,
    category: "Accessories",
    stockCount: 85,
    images: ["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.9, count: 1200 }
  },
  {
    name: "LG UltraGear 27-inch",
    description: "27-inch QHD (2560x1440) OLED Gaming Monitor, 240Hz, 0.03ms Response Time.",
    price: 899.99,
    category: "Monitors",
    stockCount: 20,
    images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.5, count: 76 }
  },
  {
    name: "Apple Studio Display",
    description: "27-inch 5K Retina display, 12MP Ultra Wide camera with Center Stage, Studio-quality mics.",
    price: 1599.00,
    category: "Monitors",
    stockCount: 12,
    images: ["https://images.unsplash.com/photo-1621360811013-c76831f16283?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.8, count: 112 }
  },
  {
    name: "Herman Miller Aeron Chair",
    description: "Ergonomic Office Chair, Size B, Graphite Finish, Fully Loaded.",
    price: 1805.00,
    category: "Furniture",
    stockCount: 5,
    images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.9, count: 420 }
  },
  {
    name: "Secretlab TITAN Evo",
    description: "Gaming Chair, Neo Hybrid Leatherette, Magnetic Memory Foam Head Pillow.",
    price: 549.00,
    category: "Furniture",
    stockCount: 25,
    images: ["https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.6, count: 850 }
  },
  {
    name: "Nintendo Switch OLED",
    description: "7-inch OLED screen, 64GB internal storage, Enhanced audio, White Joy-Con.",
    price: 349.99,
    category: "Gaming",
    stockCount: 60,
    images: ["https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.8, count: 1500 }
  },
  {
    name: "PlayStation 5 Console",
    description: "Ultra-High Speed SSD, Ray Tracing, 4K-TV Gaming, Up to 120fps.",
    price: 499.99,
    category: "Gaming",
    stockCount: 3,
    images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.9, count: 3200 }
  },
  {
    name: "Oculus Quest 3",
    description: "Advanced All-in-One VR Headset, 128GB, Asgard's Wrath 2 Bundle.",
    price: 499.99,
    category: "Gaming",
    stockCount: 45,
    images: ["https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=1000&auto=format&fit=crop"],
    ratings: { average: 4.7, count: 412 }
  }
];

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully.");

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Product.deleteMany({});
    
    // Create Admin
    console.log("Creating admin user...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const adminUser = await User.create({
      username: "admin",
      email: "admin@store.com",
      password: adminPassword,
      role: "admin",
      wishlist: []
    });
    console.log(`Admin created: ${adminUser.username} | Password: admin123`);

    // Create Normal Users
    console.log("Creating normal users...");
    const normalUsers = [];
    const userPassword = await bcrypt.hash("password123", 10);
    
    for (let i = 1; i <= 5; i++) {
      normalUsers.push({
        username: `user${i}`,
        email: `user${i}@store.com`,
        password: userPassword,
        role: "user",
        wishlist: []
      });
    }
    
    await User.insertMany(normalUsers);
    console.log(`Created 5 normal users (user1 to user5) | Password: password123`);

    // Create Products
    console.log("Creating products...");
    await Product.insertMany(dummyProducts);
    console.log(`Created ${dummyProducts.length} products.`);

    console.log("Database seeded successfully! 🌱");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
