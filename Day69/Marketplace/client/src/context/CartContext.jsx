import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data.cart);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchCart();
    else setCart({ items: [] });
  }, [user, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post("/cart", { productId, quantity });
    setCart(data.cart);
  };

  const updateCartItem = async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    setCart(data.cart);
  };

  const removeCartItem = async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    setCart(data.cart);
  };

  const clearCart = async () => {
    await api.delete("/cart");
    setCart({ items: [] });
  };

  const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, addToCart, updateCartItem, removeCartItem, clearCart, cartCount, cartTotal, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
