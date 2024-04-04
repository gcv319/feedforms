'use client'

import React, { useState } from 'react';

export default function RecipeForm() {
  const [name, setName] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [image, setImage] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ name, ingredients, image, category });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Recipe Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="ingredients">Ingredients:</label>
        <select
          id="ingredients"
          multiple
          value={ingredients}
          onChange={(e) => setIngredients(Array.from(e.target.selectedOptions, (option) => option.value))}
        >
          <option value="ingredient1">Ingredient 1</option>
          <option value="ingredient2">Ingredient 2</option>
        </select>
      </div>

      <div>
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(URL.createObjectURL(e.target.files![0]))}
        />
      </div>

      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="category1">Category 1</option>
          <option value="category2">Category 2</option>
        </select>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};