import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { cart, updateCartItem, removeCartItem, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/products" className="text-brand-600 font-medium">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item._id} className="flex items-center gap-4 border-b border-gray-200 pb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">Rs {item.price}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => updateCartItem(item._id, Number(e.target.value))}
              className="w-16 border border-gray-300 rounded-lg px-2 py-1"
            />
            <p className="font-semibold w-20 text-right">Rs {item.price * item.quantity}</p>
            <button onClick={() => removeCartItem(item._id)} className="text-red-500 text-sm hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6 text-lg font-bold">
        <span>Total</span>
        <span>Rs {cartTotal}</span>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full mt-6 bg-brand-600 text-white font-medium py-3 rounded-lg hover:bg-brand-700"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default Cart;
