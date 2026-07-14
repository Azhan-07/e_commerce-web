const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, products: [], total: 0 });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, size, color } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, products: [], total: 0 });
    }

    const existingItemIndex = cart.products.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      cart.products[existingItemIndex].quantity += quantity || 1;
    } else {
      cart.products.push({
        product: productId,
        title: product.title,
        image: product.images[0],
        price: product.discount
          ? product.price - (product.price * product.discount) / 100
          : product.price,
        size,
        color,
        quantity: quantity || 1,
      });
    }

    cart.calculateTotal();
    await cart.save();

    cart = await Cart.findOne({ user: req.user._id }).populate("products.product");
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.products.id(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    cart.calculateTotal();
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (item) => item._id.toString() !== req.params.id
    );

    cart.calculateTotal();
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product"
    );
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.products = [];
      cart.total = 0;
      await cart.save();
    }
    res.json({ message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};
