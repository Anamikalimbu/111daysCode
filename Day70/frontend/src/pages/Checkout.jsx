import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Checkout() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    street: "",
    city: "",
    phone: "",
    paymentMethod: "Cash on Delivery",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.items.length === 0) { toast.error("Cart is empty"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: { street: form.street, city: form.city, phone: form.phone },
        paymentMethod: form.paymentMethod,
      });
      toast.success("Order placed! 🎉");
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-4 text-lg">Shipping Details</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Street Address</label>
              <input name="street" value={form.street} onChange={handleChange} className="input" placeholder="Mainroad, Near Hospital" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
              <input name="city" value={form.city} onChange={handleChange} className="input" placeholder="Itahari" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="98XXXXXXXX" required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Method</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="input">
                <option>Cash on Delivery</option>
                <option>eSewa</option>
                <option>Khalti</option>
              </select>
            </div>
            <button type="submit" className="btn-primary py-3 w-full mt-2" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order 🎉"}
            </button>
          </form>
        </div>

        {/* Order Review */}
        <div className="card p-6 h-fit">
          <h2 className="font-semibold text-gray-800 mb-4 text-lg">Order Review</h2>
          <div className="flex flex-col gap-3 mb-4">
            {cart.items.map((item) => (
              <div key={item.product._id} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.product.name} × {item.quantity}</span>
                <span className="font-semibold">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span>₹{cart.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
