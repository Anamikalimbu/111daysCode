import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product.id);

  return (
    <div className="product-card glass">
      <div className="product-image-container">
        {product.isNew && <span className="badge-new">New</span>}
        <button 
          className="btn-wishlist" 
          onClick={() => toggleWishlist(product)}
          style={{ color: isLiked ? '#ec4899' : '' }}
        >
          <Heart size={18} fill={isLiked ? '#ec4899' : 'none'} />
        </button>
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-bottom">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="btn-add-cart" onClick={() => addToCart(product)}>
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
