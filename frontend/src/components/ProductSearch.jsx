import React from 'react';
import './ProductSearch.css';

const ProductSearch = ({ onSearch }) => {
  return (
    <div className="search-control">
      <span className="search-icon">⌕</span>

      <input
        type="text"
        className="search-input"
        placeholder="Search products..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default ProductSearch;