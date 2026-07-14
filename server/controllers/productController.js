const Product = require("../models/Product");

exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let query = {};

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.category) {
      query.category = { $in: req.query.category.split(",") };
    }

    if (req.query.gender) {
      query.gender = { $in: req.query.gender.split(",") };
    }

    if (req.query.size) {
      query.sizes = { $in: req.query.size.split(",") };
    }

    if (req.query.color) {
      query.colors = { $in: req.query.color.split(",") };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.featured) {
      query.featured = req.query.featured === "true";
    }

    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price-low":
          sort = { price: 1 };
          break;
        case "price-high":
          sort = { price: -1 };
          break;
        case "rating":
          sort = { rating: -1 };
          break;
        case "newest":
          sort = { createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "fullname"
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      discount,
      category,
      gender,
      sizes,
      colors,
      stock,
      featured,
    } = req.body;

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const product = await Product.create({
      title,
      description,
      price,
      discount,
      category,
      gender,
      sizes: sizes ? (typeof sizes === "string" ? JSON.parse(sizes) : sizes) : [],
      colors: colors ? (typeof colors === "string" ? JSON.parse(colors) : colors) : [],
      stock,
      featured: featured === "true" || featured === true,
      images,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      title,
      description,
      price,
      discount,
      category,
      gender,
      sizes,
      colors,
      stock,
      featured,
    } = req.body;

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.discount = discount !== undefined ? discount : product.discount;
    product.category = category || product.category;
    product.gender = gender || product.gender;
    product.sizes = sizes
      ? typeof sizes === "string"
        ? JSON.parse(sizes)
        : sizes
      : product.sizes;
    product.colors = colors
      ? typeof colors === "string"
        ? JSON.parse(colors)
        : colors
      : product.colors;
    product.stock = stock !== undefined ? stock : product.stock;
    product.featured =
      featured !== undefined
        ? featured === "true" || featured === true
        : product.featured;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      product.images = [...product.images, ...newImages];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = {
      user: req.user._id,
      name: req.user.fullname,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getNewArrivals = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(8);
    res.json(products);
  } catch (error) {
    next(error);
  }
};
