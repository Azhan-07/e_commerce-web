import { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ products: [], total: 0 });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await API.get("/cart");
      setCart(data);
      setCartCount(data.products.reduce((acc, item) => acc + item.quantity, 0));
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ products: [], total: 0 });
      setCartCount(0);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1, size, color) => {
    const { data } = await API.post("/cart", { productId, quantity, size, color });
    setCart(data);
    setCartCount(data.products.reduce((acc, item) => acc + item.quantity, 0));
  };

  const updateQuantity = async (itemId, quantity) => {
    const { data } = await API.put(`/cart/${itemId}`, { quantity });
    setCart(data);
    setCartCount(data.products.reduce((acc, item) => acc + item.quantity, 0));
  };

  const removeFromCart = async (itemId) => {
    const { data } = await API.delete(`/cart/${itemId}`);
    setCart(data);
    setCartCount(data.products.reduce((acc, item) => acc + item.quantity, 0));
  };

  const clearCart = async () => {
    await API.delete("/cart");
    setCart({ products: [], total: 0 });
    setCartCount(0);
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
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
