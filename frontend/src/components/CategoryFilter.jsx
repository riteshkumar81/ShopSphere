import React from 'react';
import './CategoryFilter.css';

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="filter-control">
      <label htmlFor="category-filter">Category</label>

      <div className="select-wrapper">
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => onSelectCategory(e.target.value)}
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <span className="select-arrow">⌄</span>
      </div>
    </div>
  );
};

export default CategoryFilter;