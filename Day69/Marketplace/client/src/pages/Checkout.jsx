import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cart, cartTotal, fetchCart } = useCart();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState({ street: "", city: "", country: "Nepal", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shippingPrice = cartTotal > 5000 ? 0 : 100;
  const totalPrice = cartTotal + shippingPrice;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/orders", {
        shippingAddress: shipping,
        paymentMethod,
      });

      if (paymentMethod === "khalti") {
        // In production: open Khalti checkout widget here, then call
        // /api/payment/khalti/verify with the returned token + order._id
        navigate(`/payment/khalti/${data.order._id}`);
      } else if (paymentMethod === "esewa") {
        // In production: redirect to eSewa payment form, then call
        // /api/payment/esewa/verify on return
        navigate(`/payment/esewa/${data.order._id}`);
      } else {
        await fetchCart();
        navigate(`/orders/${data.order._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Shipping Address</h2>
          {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input
              required
              value={shipping.street}
              onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              required
              value={shipping.city}
              onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              required
              value={shipping.phone}
              onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <h2 className="font-semibold text-lg pt-4">Payment Method</h2>
          <div className="space-y-2">
            {[
              { id: "cod", label: "Cash on Delivery" },
              { id: "khalti", label: "Khalti" },
              { id: "esewa", label: "eSewa" },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer ${
                  paymentMethod === opt.id ? "border-brand-600 bg-brand-50" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === opt.id}
                  onChange={() => setPaymentMethod(opt.id)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            {cart.items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>Rs {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs {cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? "Free" : `Rs ${shippingPrice}`}</span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2">
              <span>Total</span>
              <span>Rs {totalPrice}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-brand-600 text-white font-medium py-3 rounded-lg hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
