const Product = require("../models/Product");
const Order = require("../models/Order");

const addReview = async (userId, productId, rating, comment) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === userId.toString()
  );
  if (alreadyReviewed) throw new Error("You have already reviewed this product");

  const deliveredOrder = await Order.findOne({
    user: userId,
    orderStatus: "delivered",
    "products.product": productId,
  });
  if (!deliveredOrder) throw new Error("You can only review products from delivered orders");

  product.reviews.push({
    user: userId,
    name: "",
    rating: Number(rating),
    comment: comment || "",
  });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  return product.reviews[product.reviews.length - 1];
};

const getReviews = async (productId) => {
  const product = await Product.findById(productId)
    .populate("reviews.user", "fullname")
    .select("reviews rating numReviews");
  if (!product) throw new Error("Product not found");
  return {
    reviews: product.reviews.sort((a, b) => b.createdAt - a.createdAt),
    rating: product.rating,
    numReviews: product.numReviews,
  };
};

const canReview = async (userId, productId) => {
  const existingReview = await Product.findOne({
    _id: productId,
    "reviews.user": userId,
  });
  if (existingReview) return false;

  const deliveredOrder = await Order.findOne({
    user: userId,
    orderStatus: "delivered",
    "products.product": productId,
  });
  return !!deliveredOrder;
};

module.exports = { addReview, getReviews, canReview };
