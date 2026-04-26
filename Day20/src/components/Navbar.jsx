import { ShoppingCart, Search, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useSearch } from '../context/SearchContext';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, toggleCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { toggleSearch } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToProducts = (e) => {
    e.preventDefault();
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar glass">
      <div className="container nav-container">
        <div className="nav-left">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <a href="/" className="logo">
            <span className="gradient-text">Nexa</span>Mart
          </a>
        </div>
        
        <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a href="/" className="nav-link active">Home</a>
          <a href="#products-section" className="nav-link" onClick={scrollToProducts}>Shop</a>
          <a href="#products-section" className="nav-link" onClick={scrollToProducts}>Categories</a>
          <a href="#" className="nav-link" onClick={(e) => {e.preventDefault(); alert("About Page Coming Soon!");}}>About</a>
        </nav>

        <div className="nav-icons">
          <button className="btn-icon" onClick={toggleSearch}>
            <Search size={20} />
          </button>
          <button className="btn-icon cart-btn" onClick={() => alert('Wishlist feature activated!')}>
            <Heart size={20} />
            {wishlistCount > 0 && <span className="cart-badge" style={{background: '#ec4899'}}>{wishlistCount}</span>}
          </button>
          <button className="btn-icon cart-btn" onClick={toggleCart}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
