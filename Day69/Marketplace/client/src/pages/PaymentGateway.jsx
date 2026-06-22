import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";

// NOTE: This is a wiring stub. In production, replace the "Simulate Payment"
// button with the real Khalti/eSewa checkout widget/redirect. Once that flow
// returns a token/transaction id, call the verify endpoint below.
const PaymentGateway = () => {
  const { gateway, orderId } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    try {
      if (gateway === "khalti") {
        await api.post("/payment/khalti/verify", {
          token: "demo-token-from-khalti-widget",
          orderId,
          amount: 0,
        });
      } else {
        await api.post("/payment/esewa/verify", {
          orderId,
          transactionUuid: "demo-uuid-from-esewa",
          totalAmount: 0,
        });
      }
      await fetchCart();
      navigate(`/orders/${orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Payment verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-xl font-bold mb-2 capitalize">{gateway} Payment</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Replace this screen with the real {gateway} checkout widget. Once the gateway confirms payment, call the
        verify endpoint to mark this order as paid.
      </p>
      {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded mb-4">{error}</p>}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="bg-brand-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-700 disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Simulate Payment Success"}
      </button>
    </div>
  );
};

export default PaymentGateway;
