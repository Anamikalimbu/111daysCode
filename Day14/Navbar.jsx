import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const activeStyle = ({ isActive }) => ({
    color: isActive ? 'red' : 'blue',
    marginRight: '15px',
    fontWeight: isActive ? 'bold' : 'normal'
  });

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <NavLink to="/" style={activeStyle}>Home</NavLink>
      <NavLink to="/about" style={activeStyle}>About</NavLink>
      <NavLink to="/contact" style={activeStyle}>Contact</NavLink>
      <NavLink to="/users/123" style={activeStyle}>User Profile (123)</NavLink>
      <NavLink to="/login" style={activeStyle}>Login</NavLink>
    </nav>
  );
}

export default Navbar;
