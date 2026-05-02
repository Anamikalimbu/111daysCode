import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ theme, toggleTheme, projectsViewed }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Anamika.dev</h2>
      </div>
      
      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
        <a href="#skills" onClick={() => setIsMobileMenuOpen(false)}>Skills</a>
        <a href="#projects" onClick={() => setIsMobileMenuOpen(false)}>Projects</a>
        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
        <div className="nav-stats">
          <span className="stats-badge">Projects Viewed: {projectsViewed}</span>
        </div>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <button 
        className="mobile-toggle" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✖' : '☰'}
      </button>
    </nav>
  );
};

export default Navbar;
