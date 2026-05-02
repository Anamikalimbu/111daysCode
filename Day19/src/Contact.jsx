import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <h2>Let's Connect</h2>
      <p>I'm currently looking for new opportunities and collaborations!</p>
      <div className="contact-links">
        <a href="mailto:hello@example.com" className="btn primary-btn">Email Me</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn secondary-btn">GitHub</a>
      </div>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Anamika Limbu. Built with React.</p>
      </footer>
    </section>
  );
};

export default Contact;
