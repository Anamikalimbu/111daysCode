import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer glass">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="/" className="logo">
              <span className="gradient-text">Nexa</span>Mart
            </a>
            <p className="footer-desc">
              Your one-stop destination for next-generation technology and premium accessories.
            </p>
          </div>
          <div className="footer-links">
            <h4>Shop</h4>
            <ul>
              <li><a href="#">Categories</a></li>
              <li><a href="#">New Arrivals</a></li>
              <li><a href="#">Featured</a></li>
              <li><a href="#">Sales</a></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NexaMart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
