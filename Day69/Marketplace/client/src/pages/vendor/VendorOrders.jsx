import { useEffect, useState } from "react";
import api from "../../services/api";

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    api.get("/orders/vendor/mine").then(({ data }) => setOrders(data.orders));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, itemId, status) => {
    await api.put(`/orders/${orderId}/items/${itemId}/status`, { status });
    loadOrders();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-2">
                Order #{order._id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString()} •{" "}
                {order.user?.name}
              </p>
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center gap-4 py-2 border-t border-gray-100">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty {item.quantity} • Rs {item.price * item.quantity}
                    </p>
                  </div>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(order._id, item._id, e.target.value)}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
