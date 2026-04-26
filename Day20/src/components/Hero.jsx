import { ArrowRight } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>
      
      <div className="container hero-content animate-fade-in">
        <span className="hero-badge">New Collection 2026</span>
        <h1 className="hero-title">
          Discover <span className="gradient-text">Next-Gen</span> Tech
        </h1>
        <p className="hero-subtitle">
          Experience the future with our curated selection of premium gadgets, designed to elevate your lifestyle.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => {
            const el = document.getElementById('products-section');
            if(el) el.scrollIntoView({behavior: 'smooth'});
          }}>
            Shop Now <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary" onClick={() => {
            const el = document.getElementById('products-section');
            if(el) el.scrollIntoView({behavior: 'smooth'});
          }}>
            View Offers
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
