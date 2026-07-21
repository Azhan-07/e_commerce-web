const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const path = require("path");
const net = require("net");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const User = require("./models/User");

dotenv.config();

const isPortAvailable = (port) => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", () => reject(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
};

const seedAdmin = async () => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      console.log("No admin found. Creating default admin...");
      await User.create({
        fullname: "Admin",
        email: "admin@king.com",
        password: "admin123",
        role: "admin",
      });
      console.log("Default admin created: admin@king.com / admin123");
    }
  } catch (error) {
    console.error("Auto-seed error:", error.message);
  }
};

let server = null;

const startServer = async () => {
  const PORT = process.env.PORT || 5000;

  try {
    const portAvailable = await isPortAvailable(PORT).catch(() => false);
    if (!portAvailable) {
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    }

    await connectDB();
    console.log("Database initialized");

    await seedAdmin();
    console.log("Database seeding complete");

    const app = express();

    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "http:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));

    app.use(cors({
      origin: process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }));

    if (process.env.NODE_ENV === "development") {
      app.use(morgan("dev"));
    }

    const generalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: { success: false, message: "Too many requests, please try again later" },
      standardHeaders: true,
      legacyHeaders: false,
    });

    const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      message: { success: false, message: "Too many authentication attempts, please try again later" },
      standardHeaders: true,
      legacyHeaders: false,
    });

    const orderLimiter = rateLimit({
      windowMs: 60 * 60 * 1000,
      max: 20,
      message: { success: false, message: "Too many orders, please try again later" },
      standardHeaders: true,
      legacyHeaders: false,
    });

    app.use("/api", generalLimiter);
    app.use("/api/user-auth/login", authLimiter);
    app.use("/api/user-auth/register", authLimiter);
    app.use("/api/user-auth/admin-login", authLimiter);
    app.use("/api/orders", orderLimiter);

    app.use(mongoSanitize());
    app.use(hpp());

    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
      maxAge: "1d",
      etag: true,
    }));

    app.use("/api/user-auth", require("./routes/userAuth"));
    app.use("/api/admin-auth", require("./routes/adminAuth"));
    app.use("/api/categories", require("./routes/categories"));
    app.use("/api/products", require("./routes/products"));
    app.use("/api/orders", require("./routes/orders"));
    app.use("/api/subscribers", require("./routes/subscriber"));

    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../client/dist")));
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    }

    app.use(errorHandler);

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
    });
  } catch (error) {
    console.error("Server initialization error:", error.message);
    process.exit(1);
  }
};

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 5000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
  gracefulShutdown("unhandledRejection");
});

startServer();
