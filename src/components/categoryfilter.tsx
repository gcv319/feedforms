import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ categories, onSelectCategory }: CategoryFilterProps) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onSelectCategory(e.target.value);
  }

  return (
    <div className="input-group mb-3">
      <select className="form-select" onChange={handleChange}>
        <option value="">All Categories</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
