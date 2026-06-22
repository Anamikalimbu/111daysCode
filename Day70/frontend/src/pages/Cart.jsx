import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some products to get started</p>
        <Link to="/products" className="btn-primary py-3 px-8 inline-block">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart 🛍️</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 flex flex-col gap-3">
          {cart.items.map((item) => (
            <div key={item.product._id} className="card p-4 flex items-center gap-4">
              <img
                src={item.product.image || "https://via.placeholder.com/80"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">{item.product.name}</h3>
                <p className="text-primary font-bold mt-0.5">₹{item.product.price}</p>
              </div>

              {/* Quantity Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-bold text-lg"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 font-bold text-lg"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-800">₹{(item.product.price * item.quantity).toFixed(0)}</p>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-xs text-red-400 hover:text-red-600 mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 text-left mt-2"
          >
            🗑 Clear cart
          </button>
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit">
          <h3 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span>Items ({cart.items.reduce((s, i) => s + i.quantity, 0)})</span>
              <span>₹{cart.totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span className="text-primary font-medium">Free</span>
            </div>
          </div>
          <div className="border-t pt-3 mb-4 flex justify-between font-bold text-gray-800">
            <span>Total</span>
            <span>₹{cart.totalPrice}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="btn-primary w-full py-3 text-center"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}
