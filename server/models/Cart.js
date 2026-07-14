const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  title: String,
  image: String,
  price: Number,
  size: String,
  color: String,
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [cartItemSchema],
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.methods.calculateTotal = function () {
  this.total = this.products.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  return this.total;
};

module.exports = mongoose.model("Cart", cartSchema);
