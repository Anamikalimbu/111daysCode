import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';
import './CartSidebar.css';

const CartSidebar = () => {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, cartTotal, setCartItems } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>
      <div className={`cart-sidebar glass ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-btn" onClick={toggleCart}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span className="cart-item-price">${item.price.toFixed(2)}</span>
                    <div className="cart-item-qty">Qty: {item.quantity}</div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary checkout-btn" onClick={() => setIsCheckoutOpen(true)}>
              Checkout
            </button>
          </div>
        )}
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onComplete={() => {
          // Note: To clear cart, we should add a clearCart to CartContext, 
          // but we can just trigger a page reload for the "prototype" feel, 
          // or we can add clearCart. Let's just reload to simulate success reset.
          window.location.reload();
        }} 
      />
    </>
  );
};

export default CartSidebar;
