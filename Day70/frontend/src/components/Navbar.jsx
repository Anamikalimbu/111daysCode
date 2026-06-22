import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          🛒 <span>Mini Mart</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/products" className="text-gray-600 hover:text-primary font-medium transition-colors">
            Products
          </Link>

          {user ? (
            <>
              <Link to="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
                🛍️ Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="text-gray-600 hover:text-primary font-medium transition-colors">
                My Orders
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Hi, {user.name.split(" ")[0]}</span>
                <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="btn-outline text-sm py-1.5">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-600 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
          <Link to="/products" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Products</Link>
          {user ? (
            <>
              <Link to="/cart" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>
                🛍️ Cart {cartCount > 0 && <span className="bg-accent text-white text-xs px-1.5 rounded-full">{cartCount}</span>}
              </Link>
              <Link to="/orders" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-500 text-left font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
