import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-brand-600">
          Marketplace
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/products" className="text-gray-700 hover:text-brand-600 text-sm font-medium">
            Shop
          </Link>

          {user?.role === "vendor" && (
            <Link to="/vendor/dashboard" className="text-gray-700 hover:text-brand-600 text-sm font-medium">
              My Store
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" className="text-gray-700 hover:text-brand-600 text-sm font-medium">
              Admin
            </Link>
          )}

          {user && user.role === "customer" && (
            <Link to="/cart" className="relative text-gray-700 hover:text-brand-600 text-sm font-medium">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <button onClick={handleLogout} className="text-sm font-medium text-gray-700 hover:text-red-600">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-brand-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
