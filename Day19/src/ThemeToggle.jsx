import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
  );
};

export default ThemeToggle;
