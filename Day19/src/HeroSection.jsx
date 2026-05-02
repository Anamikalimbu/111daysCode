import React from 'react';

const HeroSection = ({ name, role, introText }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1>Hi, I'm <span className="highlight">{name}</span></h1>
        <h2>{role}</h2>
        <p>{introText}</p>
        <div className="hero-buttons">
          <a href="#projects" className="btn primary-btn">View My Work</a>
          <a href="#contact" className="btn secondary-btn">Contact Me</a>
        </div>
      </div>
      <div className="hero-image-container">
        <img 
          src="./assets/img.png" 
          alt="Anamika Limbu" 
          className="hero-image" 
        />
      </div>
    </section>
  );
};

export default HeroSection;
