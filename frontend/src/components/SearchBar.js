import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch, onClear }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Rechercher par marque ou produit..."
          value={query}
          onChange={handleInputChange}
          className="search-input"
        />
        {query && (
          <button
            className="clear-button"
            onClick={handleClear}
            title="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
