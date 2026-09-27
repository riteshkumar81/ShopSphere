import React from 'react';
import './PriceSort.css';

const PriceSort = ({ sortOption, onSortChange }) => {
  return (
    <div className="price-sort">
      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="default">Default</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
      </select>
    </div>
  );
};

export default PriceSort;