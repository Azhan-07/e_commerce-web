/**
 * Product Service
 */

const Product = require("../models/Product");
const Category = require("../models/Category");

const buildProductQuery = (filters) => {
  let query = {};

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters.category) {
    query.category = { $in: filters.category.split(",") };
  }

  if (filters.gender) {
    query.gender = { $in: filters.gender.split(",") };
  }

  if (filters.size) {
    query.sizes = { $in: filters.size.split(",") };
  }

  if (filters.color) {
    query.colors = { $in: filters.color.split(",") };
  }

  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
  }

  if (filters.featured) {
    query.featured = filters.featured === "true";
  }

  return query;
};

const buildSortQuery = (sortBy) => {
  const sortMap = {
    "price-low": { price: 1 },
    "price-high": { price: -1 },
    rating: { rating: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "name-asc": { title: 1 },
    "name-desc": { title: -1 },
  };

  return sortMap[sortBy] || { createdAt: -1 };
};

const getProductsWithPagination = async (filters, page = 1, limit = 12) => {
  const skip = (page - 1) * limit;
  const query = buildProductQuery(filters);
  const sort = buildSortQuery(filters.sort);

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    products,
    page,
    pages: Math.ceil(total / limit),
    total,
  };
};

const getFeaturedProducts = async (limit = 8) => {
  return await Product.find({ featured: true })
    .limit(limit)
    .lean();
};

const getNewArrivals = async (limit = 8) => {
  return await Product.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

const getTopRatedProducts = async (limit = 8) => {
  return await Product.find({})
    .sort({ rating: -1 })
    .limit(limit)
    .lean();
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const createProduct = async (productData, imageUrls = []) => {
  const product = new Product({
    ...productData,
    images: imageUrls,
  });
  return await product.save();
};

const updateProduct = async (id, updateData, newImageUrls = []) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  Object.assign(product, updateData);
  if (newImageUrls.length > 0) {
    product.images = [...product.images, ...newImageUrls];
  }

  return await product.save();
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new Error("Product not found");
  return product;
};

module.exports = {
  getProductsWithPagination,
  getFeaturedProducts,
  getNewArrivals,
  getTopRatedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  buildProductQuery,
  buildSortQuery,
};
