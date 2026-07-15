import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ products: [], total: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("guestCart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        setCartCount(parsedCart.products.reduce((acc, item) => acc + item.quantity, 0));
      } catch (error) {
        console.error("Failed to load cart from localStorage", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("guestCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (productId, quantity = 1, size, color, productData) => {
    const newItem = {
      _id: Math.random().toString(36).substr(2, 9),
      product: productId,
      title: productData?.title || "Product",
      image: productData?.images?.[0] || "",
      price: productData?.price || 0,
      size,
      color,
      quantity,
    };

    const existingItemIndex = cart.products.findIndex(
      (item) =>
        item.product === productId &&
        item.size === size &&
        item.color === color
    );

    let updatedCart;
    if (existingItemIndex > -1) {
      const updatedProducts = [...cart.products];
      updatedProducts[existingItemIndex].quantity += quantity;
      updatedCart = { ...cart, products: updatedProducts };
    } else {
      updatedCart = { ...cart, products: [...cart.products, newItem] };
    }

    // Calculate total
    updatedCart.total = updatedCart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    setCart(updatedCart);
    setCartCount(updatedCart.products.reduce((acc, item) => acc + item.quantity, 0));
  };

  const updateQuantity = async (itemId, quantity) => {
    const updatedProducts = cart.products.map((item) =>
      item._id === itemId ? { ...item, quantity } : item
    );

    const updatedCart = { ...cart, products: updatedProducts };
    updatedCart.total = updatedCart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    setCart(updatedCart);
    setCartCount(updatedCart.products.reduce((acc, item) => acc + item.quantity, 0));
  };

  const removeFromCart = async (itemId) => {
    const updatedProducts = cart.products.filter((item) => item._id !== itemId);

    const updatedCart = { ...cart, products: updatedProducts };
    updatedCart.total = updatedCart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    setCart(updatedCart);
    setCartCount(updatedCart.products.reduce((acc, item) => acc + item.quantity, 0));
  };

  const clearCart = async () => {
    setCart({ products: [], total: 0 });
    setCartCount(0);
    localStorage.removeItem("guestCart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
