import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const steps = ["Pending", "Processing", "Shipped", "Delivered"];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(({ data }) => setOrder(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading order...</div>;
  if (!order) return <div className="text-center py-20 text-gray-400">Order not found</div>;

  const stepIndex = steps.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/orders" className="text-primary text-sm hover:underline mb-4 inline-block">← Back to Orders</Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
          <p className="text-gray-400 text-sm font-mono">#{order._id.slice(-8).toUpperCase()}</p>
        </div>
        <span className={`text-sm font-semibold px-4 py-1.5 rounded-full ${statusColor[order.status] || ""}`}>
          {order.status}
        </span>
      </div>

      {/* Progress Bar */}
      {order.status !== "Cancelled" && (
        <div className="card p-5 mb-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 z-0">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(stepIndex / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step, i) => (
              <div key={step} className="flex flex-col items-center z-10 gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i <= stepIndex ? "bg-primary text-white" : "bg-gray-200 text-gray-400"}`}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className="text-xs text-gray-500 hidden md:block">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="card p-5 mb-5">
        <h2 className="font-semibold text-gray-800 mb-3">Items Ordered</h2>
        <div className="flex flex-col gap-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
              <img
                src={item.image || "https://via.placeholder.com/50"}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
            </div>
          ))}
        </div>
        <div className="pt-3 flex justify-between font-bold text-gray-800">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </div>

      {/* Shipping & Payment */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-2">Shipping Address</h2>
          <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
          <p className="text-sm text-gray-600">{order.shippingAddress.city}</p>
          <p className="text-sm text-gray-600">📞 {order.shippingAddress.phone}</p>
        </div>
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-2">Payment</h2>
          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
          <p className={`text-sm font-medium mt-1 ${order.isPaid ? "text-green-600" : "text-yellow-600"}`}>
            {order.isPaid ? "✅ Paid" : "⏳ Payment Pending"}
          </p>
        </div>
      </div>
    </div>
  );
}
