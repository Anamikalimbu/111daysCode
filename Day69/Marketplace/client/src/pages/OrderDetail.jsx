import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order));
  }, [id]);

  if (!order) return <p className="text-center py-20 text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">Order #{order._id.slice(-8)}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Placed on {new Date(order.createdAt).toLocaleDateString()} • Payment: {order.paymentMethod.toUpperCase()} •{" "}
        {order.isPaid ? "Paid" : "Payment Pending"}
      </p>

      <div className="space-y-3 mb-6">
        {order.items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 border-b border-gray-200 pb-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                Qty {item.quantity} × Rs {item.price}
              </p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[item.status]}`}>
              {item.status}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-1 text-sm mb-6">
        <div className="flex justify-between">
          <span>Items</span>
          <span>Rs {order.itemsPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Rs {order.shippingPrice}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-1">
          <span>Total</span>
          <span>Rs {order.totalPrice}</span>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <p className="text-sm text-gray-600">
          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
          <br />
          Phone: {order.shippingAddress.phone}
        </p>
      </div>
    </div>
  );
};

export default OrderDetail;
