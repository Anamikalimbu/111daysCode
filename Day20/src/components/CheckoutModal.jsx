import { CheckCircle, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import './CheckoutModal.css';

const CheckoutModal = ({ isOpen, onClose, onComplete }) => {
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="checkout-overlay">
      <div className="checkout-modal glass">
        {isProcessing ? (
          <div className="checkout-processing">
            <Loader className="spinner" size={48} />
            <h3>Processing Payment...</h3>
            <p>Please do not close this window.</p>
          </div>
        ) : (
          <div className="checkout-success animate-fade-in">
            <CheckCircle className="success-icon" size={64} />
            <h3>Order Successful!</h3>
            <p>Thank you for shopping with NexaMart.</p>
            <button className="btn btn-primary" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
