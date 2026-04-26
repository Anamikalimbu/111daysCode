import { Search, X } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import './SearchModal.css';

const SearchModal = () => {
  const { searchQuery, setSearchQuery, isSearchOpen, toggleSearch } = useSearch();

  if (!isSearchOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-modal glass">
        <button className="close-search" onClick={toggleSearch}>
          <X size={24} />
        </button>
        <div className="search-input-wrapper">
          <Search className="search-icon-input" size={24} />
          <input
            type="text"
            className="search-input"
            placeholder="Search for products, categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
