import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const statusColor = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/my")
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400">Loading orders...</div>;

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
        <Link to="/products" className="btn-primary py-3 px-8 inline-block">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders 📋</h1>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link key={order._id} to={`/orders/${order._id}`} className="card p-5 hover:border-primary border transition-all block">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-NP", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status] || ""}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{order.items.length} item{order.items.length > 1 ? "s" : ""}</p>
              <p className="font-bold text-gray-800">₹{order.totalPrice}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
