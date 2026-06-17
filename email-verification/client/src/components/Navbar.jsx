import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-brand">
        <span className="brand-icon">✉️</span>
        <span>EmailVerify</span>
      </Link>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">
              <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
              <span>{user?.name}</span>
            </span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;