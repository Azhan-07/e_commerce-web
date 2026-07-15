/**
 * Product Controller
 */

const { successResponse, errorResponse } = require("../utils/responses");
const productService = require("../services/productService");

exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    const result = await productService.getProductsWithPagination(req.query, page, limit);

    return res.status(200).json(
      successResponse(200, "Products retrieved successfully", result)
    );
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json(
        errorResponse(404, "Product not found")
      );
    }

    return res.status(200).json(
      successResponse(200, "Product retrieved successfully", product)
    );
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
      stock,
      featured,
    } = req.body;

    const imageUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const sizes = req.body.sizes
      ? typeof req.body.sizes === "string"
        ? JSON.parse(req.body.sizes)
        : req.body.sizes
      : [];

    const colors = req.body.colors
      ? typeof req.body.colors === "string"
        ? JSON.parse(req.body.colors)
        : req.body.colors
      : [];

    const product = await productService.createProduct(
      {
        title,
        description,
        price,
        discount: discount || 0,
        category,
        gender,
        sizes,
        colors,
        stock,
        featured: featured === "true" || featured === true,
      },
      imageUrls
    );

    return res.status(201).json(
      successResponse(201, "Product created successfully", product)
    );
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      discount,
      category,
      gender,
      stock,
      featured,
    } = req.body;

    const imageUrls = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const sizes = req.body.sizes
      ? typeof req.body.sizes === "string"
        ? JSON.parse(req.body.sizes)
        : req.body.sizes
      : undefined;

    const colors = req.body.colors
      ? typeof req.body.colors === "string"
        ? JSON.parse(req.body.colors)
        : req.body.colors
      : undefined;

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(price !== undefined && { price }),
      ...(discount !== undefined && { discount }),
      ...(category && { category }),
      ...(gender && { gender }),
      ...(stock !== undefined && { stock }),
      ...(featured !== undefined && { featured: featured === "true" || featured === true }),
      ...(sizes && { sizes }),
      ...(colors && { colors }),
    };

    const product = await productService.updateProduct(
      req.params.id,
      updateData,
      imageUrls
    );

    return res.status(200).json(
      successResponse(200, "Product updated successfully", product)
    );
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);

    return res.status(200).json(
      successResponse(200, "Product deleted successfully")
    );
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await productService.getFeaturedProducts();

    return res.status(200).json(
      successResponse(200, "Featured products retrieved", products)
    );
  } catch (error) {
    next(error);
  }
};

exports.getNewArrivals = async (req, res, next) => {
  try {
    const products = await productService.getNewArrivals();

    return res.status(200).json(
      successResponse(200, "New arrivals retrieved", products)
    );
  } catch (error) {
    next(error);
  }
};

exports.getBestSellers = async (req, res, next) => {
  try {
    const products = await productService.getTopRatedProducts();

    return res.status(200).json(
      successResponse(200, "Best sellers retrieved", products)
    );
  } catch (error) {
    next(error);
  }
};
