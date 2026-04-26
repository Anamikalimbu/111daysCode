import { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, isSearchOpen, toggleSearch }}>
      {children}
    </SearchContext.Provider>
  );
};
