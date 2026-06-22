import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return setCart({ items: [], totalPrice: 0 });
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error("Please login to add items"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/cart", { productId, quantity });
      setCart(data);
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      setCart(data);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data);
      toast.success("Item removed");
    } catch (err) {
      toast.error("Remove failed");
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setCart({ items: [], totalPrice: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
