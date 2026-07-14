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
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("No users found. Seeding database...");
      await User.create([
        {
          fullname: "Admin User",
          email: "admin@king.com",
          password: "admin123",
          role: "admin",
        },
        {
          fullname: "John Doe",
          email: "john@example.com",
          password: "john123",
          role: "user",
        },
      ]);
      console.log("Users seeded.");
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
  { title:"Classic White Oxford Shirt", description:"A timeless white Oxford shirt crafted from premium cotton. Perfect for both casual and formal occasions with a tailored fit.", price:89.99, discount:10, category:"shirts", gender:"men", sizes:["S","M","L","XL"], colors:["White","Light Blue"], stock:50, images:["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"], featured:true, rating:4.5, numReviews:12, reviews:[] },
  { title:"Slim Fit Dark Wash Jeans", description:"Premium dark wash denim jeans with a modern slim fit. Stretch fabric for all-day comfort.", price:119.99, discount:0, category:"jeans", gender:"men", sizes:["S","M","L","XL","XXL"], colors:["Dark Blue","Black"], stock:35, images:["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600"], featured:true, rating:4.3, numReviews:8, reviews:[] },
  { title:"Luxury Cashmere Hoodie", description:"Ultra-soft cashmere blend hoodie for ultimate comfort. Minimalist design with premium finishes.", price:199.99, discount:15, category:"hoodies", gender:"men", sizes:["M","L","XL"], colors:["Charcoal","Navy","Camel"], stock:20, images:["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600"], featured:true, rating:4.8, numReviews:20, reviews:[] },
  { title:"Running Performance Sneakers", description:"Lightweight performance sneakers with responsive cushioning. Breathable mesh upper for optimal airflow.", price:159.99, discount:20, category:"shoes", gender:"men", sizes:["8","9","10","11","12"], colors:["White/Black","Grey/Blue"], stock:45, images:["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"], featured:true, rating:4.6, numReviews:30, reviews:[] },
  { title:"Bomber Jacket - Olive", description:"Classic bomber jacket in premium olive nylon. Ribbed cuffs and hem with interior pocket.", price:249.99, discount:0, category:"jackets", gender:"men", sizes:["M","L","XL"], colors:["Olive","Black"], stock:15, images:["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"], featured:true, rating:4.7, numReviews:15, reviews:[] },
  { title:"Leather Crossbody Bag", description:"Handcrafted Italian leather crossbody bag. Adjustable strap with brass hardware.", price:179.99, discount:5, category:"accessories", gender:"unisex", sizes:[], colors:["Brown","Black","Tan"], stock:25, images:["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600"], featured:false, rating:4.4, numReviews:10, reviews:[] },
  { title:"Floral Wrap Dress", description:"Elegant floral wrap dress in lightweight chiffon. Flattering silhouette with adjustable tie waist.", price:139.99, discount:25, category:"dresses", gender:"women", sizes:["XS","S","M","L"], colors:["Floral Pink","Floral Blue"], stock:30, images:["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600"], featured:true, rating:4.6, numReviews:18, reviews:[] },
  { title:"High-Waist Mom Jeans", description:"Relaxed fit high-waist jeans with a vintage wash. Premium denim with just the right amount of stretch.", price:99.99, discount:0, category:"jeans", gender:"women", sizes:["XS","S","M","L","XL"], colors:["Light Wash","Medium Wash"], stock:40, images:["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600"], featured:false, rating:4.2, numReviews:22, reviews:[] },
  { title:"Oversized Wool Blend Coat", description:"Luxurious oversized coat in soft wool blend. Double-breasted design with horn buttons.", price:349.99, discount:10, category:"jackets", gender:"women", sizes:["S","M","L"], colors:["Camel","Black","Cream"], stock:12, images:["https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600"], featured:true, rating:4.9, numReviews:8, reviews:[] },
  { title:"Silk Camisole Top", description:"Delicate silk camisole with adjustable spaghetti straps. Luxurious drape and feel.", price:79.99, discount:0, category:"shirts", gender:"women", sizes:["XS","S","M","L"], colors:["Champagne","Black","Ivory"], stock:28, images:["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600"], featured:false, rating:4.5, numReviews:14, reviews:[] },
  { title:"Kids Denim Overalls", description:"Adorable denim overalls for kids. Durable construction with adjustable straps and multiple pockets.", price:49.99, discount:0, category:"jeans", gender:"kids", sizes:["XS","S","M"], colors:["Blue","Light Blue"], stock:35, images:["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600"], featured:false, rating:4.4, numReviews:16, reviews:[] },
  { title:"Kids Graphic Tee Pack", description:"Set of 3 organic cotton graphic tees for kids. Fun prints with tag-free comfort.", price:39.99, discount:15, category:"tshirts", gender:"kids", sizes:["XS","S","M","L"], colors:["Multi"], stock:50, images:["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600"], featured:false, rating:4.3, numReviews:25, reviews:[] },
  { title:"Ribbed Knit Sweater", description:"Cozy ribbed knit sweater in soft merino wool. Relaxed fit perfect for layering.", price:129.99, discount:0, category:"hoodies", gender:"women", sizes:["XS","S","M","L","XL"], colors:["Cream","Burgundy","Forest Green"], stock:22, images:["https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600"], featured:false, rating:4.6, numReviews:11, reviews:[] },
  { title:"Canvas Low-Top Sneakers", description:"Classic canvas sneakers with vulcanized rubber sole. Timeless style for everyday wear.", price:69.99, discount:0, category:"shoes", gender:"unisex", sizes:["6","7","8","9","10","11"], colors:["White","Black","Navy","Red"], stock:60, images:["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600"], featured:false, rating:4.1, numReviews:35, reviews:[] },
  { title:"Tailored Linen Pants", description:"Lightweight linen blend trousers with a tailored fit. Perfect for warm weather elegance.", price:109.99, discount:10, category:"pants", gender:"men", sizes:["S","M","L","XL"], colors:["Khaki","White","Navy"], stock:30, images:["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600"], featured:false, rating:4.3, numReviews:9, reviews:[] },
  { title:"Leather Belt - Italian Craft", description:"Handcrafted Italian leather belt with brushed silver buckle. A wardrobe essential.", price:59.99, discount:0, category:"accessories", gender:"men", sizes:["S","M","L"], colors:["Black","Brown"], stock:40, images:["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"], featured:false, rating:4.7, numReviews:20, reviews:[] },
  { title:"Puffer Vest - Lightweight", description:"Lightweight packable puffer vest. Water-resistant shell with synthetic insulation.", price:149.99, discount:20, category:"jackets", gender:"unisex", sizes:["S","M","L","XL"], colors:["Black","Olive","Navy"], stock:25, images:["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"], featured:false, rating:4.5, numReviews:13, reviews:[] },
  { title:"Cotton Shorts - Summer Edit", description:"Relaxed fit cotton shorts with side pockets. Breathable fabric for summer comfort.", price:49.99, discount:0, category:"shorts", gender:"men", sizes:["S","M","L","XL"], colors:["Khaki","Navy","White"], stock:55, images:["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600"], featured:false, rating:4.2, numReviews:18, reviews:[] },
  { title:"Velvet Evening Dress", description:"Stunning velvet evening dress with a plunging neckline. Floor-length design for special occasions.", price:279.99, discount:0, category:"dresses", gender:"women", sizes:["XS","S","M","L"], colors:["Emerald","Midnight Blue","Burgundy"], stock:10, images:["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600"], featured:true, rating:4.9, numReviews:6, reviews:[] },
  { title:"Polarized Sunglasses", description:"Premium polarized sunglasses with UV400 protection. Lightweight titanium frame.", price:189.99, discount:15, category:"accessories", gender:"unisex", sizes:[], colors:["Gold/Brown","Silver/Grey","Matte Black"], stock:30, images:["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"], featured:false, rating:4.6, numReviews:22, reviews:[] },
  { title:"Striped Long Sleeve Tee", description:"Classic Breton stripe long sleeve tee in soft cotton jersey. A nautical wardrobe staple.", price:59.99, discount:0, category:"tshirts", gender:"men", sizes:["S","M","L","XL"], colors:["Navy/White","Black/White"], stock:45, images:["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600"], featured:false, rating:4.4, numReviews:15, reviews:[] },
  { title:"Platform Chelsea Boots", description:"Chunky platform Chelsea boots in smooth leather. Elastic side panels with pull tab.", price:219.99, discount:0, category:"shoes", gender:"women", sizes:["6","7","8","9","10"], colors:["Black","Brown"], stock:20, images:["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600"], featured:true, rating:4.7, numReviews:12, reviews:[] },
  { title:"Cargo Jogger Pants", description:"Technical cargo joggers with multiple pockets. Tapered fit with elastic cuffs.", price:89.99, discount:10, category:"pants", gender:"men", sizes:["S","M","L","XL","XXL"], colors:["Black","Olive","Grey"], stock:35, images:["https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600"], featured:false, rating:4.3, numReviews:19, reviews:[] },
  { title:"Cropped Cardigan", description:"Soft cropped cardigan with mother-of-pearl buttons. Boxy fit for effortless layering.", price:99.99, discount:0, category:"hoodies", gender:"women", sizes:["XS","S","M","L"], colors:["Pink","Lilac","Cream"], stock:18, images:["https://images.unsplash.com/photo-1434389677669-e08b4cda3a0e?w=600"], featured:false, rating:4.5, numReviews:7, reviews:[] },
  { title:"Wool Fedora Hat", description:"Classic wool fedora with grosgrain ribbon band. Structured crown with pinched front.", price:79.99, discount:0, category:"accessories", gender:"unisex", sizes:[], colors:["Charcoal","Brown","Black"], stock:20, images:["https://images.unsplash.com/photo-1514327605112-8862400ef024?w=600"], featured:false, rating:4.2, numReviews:11, reviews:[] },
  { title:"Kids Rain Boots", description:"Waterproof rain boots for kids with fun prints. Non-slip sole and easy pull-on design.", price:34.99, discount:0, category:"shoes", gender:"kids", sizes:["6","7","8","9","10"], colors:["Red","Blue","Yellow"], stock:40, images:["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600"], featured:false, rating:4.6, numReviews:28, reviews:[] },
  { title:"Satin Midi Skirt", description:"Elegant satin midi skirt with side slit. Luxurious sheen with comfortable elastic waist.", price:89.99, discount:10, category:"pants", gender:"women", sizes:["XS","S","M","L"], colors:["Champagne","Emerald","Navy"], stock:22, images:["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600"], featured:false, rating:4.4, numReviews:13, reviews:[] },
  { title:"Quilted Field Jacket", description:"Insulated quilted field jacket with corduroy collar. Multiple pockets for utility.", price:199.99, discount:0, category:"jackets", gender:"men", sizes:["M","L","XL"], colors:["Navy","Olive","Rust"], stock:15, images:["https://images.unsplash.com/photo-1544923246-77307dd270cb?w=600"], featured:false, rating:4.8, numReviews:10, reviews:[] },
  { title:"Cashmere Beanie", description:"Luxuriously soft cashmere beanie with ribbed fold. Lightweight warmth for cold days.", price:49.99, discount:0, category:"accessories", gender:"unisex", sizes:[], colors:["Grey","Navy","Camel","Black"], stock:50, images:["https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600"], featured:false, rating:4.5, numReviews:24, reviews:[] },
  { title:"Relaxed Linen Shirt", description:"Breathable linen shirt with relaxed fit. Camp collar with coconut shell buttons.", price:94.99, discount:15, category:"shirts", gender:"men", sizes:["S","M","L","XL"], colors:["White","Sky Blue","Sage"], stock:28, images:["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600"], featured:false, rating:4.3, numReviews:16, reviews:[] },
];

connectDB().then(() => {
  seedIfEmpty().then(() => {
    const app = express();

    app.use(helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }));
    app.use(
      cors({
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5173", "http://localhost:3000"],
        credentials: true,
      })
    );

    if (process.env.NODE_ENV === "development") {
      app.use(morgan("dev"));
    }

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
    });
    app.use("/api", limiter);

    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true }));

    app.use("/uploads", express.static(path.join(__dirname, "uploads")));

    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/products", require("./routes/products"));
    app.use("/api/cart", require("./routes/cart"));
    app.use("/api/orders", require("./routes/orders"));
    app.use("/api/subscribe", require("./routes/subscriber"));

    if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../client/dist")));
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist/index.html"));
      });
    }

    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
});
