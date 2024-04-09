import React from 'react';

interface SearchBarProps {
  onSearchChange: (searchTerm: string) => void;
}

export default function SearchBar({ onSearchChange }: SearchBarProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSearchChange(e.target.value);
  }

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Search recipes"
        onChange={handleChange}
      />
    </div>
  );
}
