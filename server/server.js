const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const User = require("./models/User");
const Product = require("./models/Product");

dotenv.config();

const seedIfEmpty = async () => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      console.log("No admin found. Creating default admin...");
      await User.create({
        fullname: "Admin User",
        email: "admin@king.com",
        password: "admin123",
        role: "admin",
      });
      console.log("Default admin created: admin@king.com / admin123");
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("No products found. Seeding products...");
      await Product.insertMany(seedProducts);
      console.log("30 products seeded.");
    }
  } catch (error) {
    console.error("Auto-seed error:", error.message);
  }
};

const seedProducts = [
  { title: "Classic White Oxford Shirt", description: "A timeless white Oxford shirt crafted from premium cotton.", price: 89.99, discount: 10, category: "shirts", gender: "men", sizes: ["S", "M", "L", "XL"], colors: ["White", "Light Blue"], stock: 50, images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"], featured: true },
  { title: "Slim Fit Dark Wash Jeans", description: "Premium dark wash denim jeans with modern slim fit.", price: 119.99, discount: 0, category: "jeans", gender: "men", sizes: ["S", "M", "L", "XL"], colors: ["Dark Blue", "Black"], stock: 35, images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"], featured: true },
  { title: "Luxury Cashmere Hoodie", description: "Ultra-soft cashmere blend hoodie for ultimate comfort.", price: 199.99, discount: 15, category: "hoodies", gender: "men", sizes: ["M", "L", "XL"], colors: ["Charcoal", "Navy"], stock: 20, images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"], featured: true },
  { title: "Running Performance Sneakers", description: "Lightweight performance sneakers with responsive cushioning.", price: 159.99, discount: 20, category: "shoes", gender: "men", sizes: ["8", "9", "10", "11"], colors: ["White/Black", "Grey/Blue"], stock: 45, images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"], featured: true },
  { title: "Bomber Jacket - Olive", description: "Classic bomber jacket in premium olive nylon.", price: 249.99, discount: 0, category: "jackets", gender: "men", sizes: ["M", "L", "XL"], colors: ["Olive", "Black"], stock: 15, images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"], featured: true },
  { title: "Leather Crossbody Bag", description: "Handcrafted Italian leather crossbody bag.", price: 179.99, discount: 5, category: "accessories", gender: "unisex", sizes: [], colors: ["Brown", "Black"], stock: 25, images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"], featured: false },
  { title: "Floral Wrap Dress", description: "Elegant floral wrap dress in lightweight chiffon.", price: 139.99, discount: 25, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L"], colors: ["Floral Pink", "Floral Blue"], stock: 30, images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"], featured: true },
  { title: "High-Waist Mom Jeans", description: "Relaxed fit high-waist jeans with vintage wash.", price: 99.99, discount: 0, category: "jeans", gender: "women", sizes: ["XS", "S", "M", "L"], colors: ["Light Wash", "Medium Wash"], stock: 40, images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600"], featured: false },
  { title: "Oversized Wool Blend Coat", description: "Luxurious oversized coat in soft wool blend.", price: 349.99, discount: 10, category: "jackets", gender: "women", sizes: ["S", "M", "L"], colors: ["Camel", "Black"], stock: 12, images: ["https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600"], featured: true },
  { title: "Silk Camisole Top", description: "Delicate silk camisole with adjustable spaghetti straps.", price: 79.99, discount: 0, category: "shirts", gender: "women", sizes: ["XS", "S", "M", "L"], colors: ["Champagne", "Black"], stock: 28, images: ["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600"], featured: false },
];

connectDB().then(() => {
  seedIfEmpty().then(() => {
    const app = express();

    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }));

    // CORS configuration
    app.use(
      cors({
        origin: process.env.NODE_ENV === "production"
          ? process.env.CLIENT_URL || false
          : ["http://localhost:5173", "http://localhost:3000"],
        credentials: true,
      })
    );

    // Logging
    if (process.env.NODE_ENV === "development") {
      app.use(morgan("dev"));
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
    });
    app.use("/api", limiter);

    // Admin login rate limit (stricter)
    const adminLoginLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: "Too many login attempts, please try again later",
    });
    app.use("/api/admin-auth/admin-login", adminLoginLimiter);

    // Body parser
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Static files
    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    // Routes
    app.use("/api/admin-auth", require("./routes/adminAuth"));
    app.use("/api/categories", require("./routes/categories"));
    app.use("/api/products", require("./routes/products"));
    app.use("/api/orders", require("./routes/orders"));

    // Production: serve frontend
    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../client/dist")));
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    }

    // Global error handler (must be last)
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
});
