import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, onLocation }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Search for a city..."
          className="search-input"
        />
        <button type="submit" className="search-button" aria-label="Search city">
          <Search size={20} />
        </button>
      </form>
      <button 
        onClick={onLocation} 
        className="location-button" 
        aria-label="Use current location"
        title="Use my current location"
      >
        <MapPin size={20} />
      </button>
    </div>
  );
};

export default SearchBar;
