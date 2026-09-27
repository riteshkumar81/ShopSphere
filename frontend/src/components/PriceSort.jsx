import React from 'react';
import './PriceSort.css';

const PriceSort = ({ sortOption, onSortChange }) => {
  return (
    <div className="filter-control">
      <label htmlFor="price-sort">Sort by</label>

      <div className="select-wrapper">
        <select
          id="price-sort"
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="">Default</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
        </select>

        <span className="select-arrow">⌄</span>
      </div>
    </div>
  );
};

export default PriceSort;