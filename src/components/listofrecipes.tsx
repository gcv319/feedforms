'use client'
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import RecipeCard from './recipecard';
import SearchBar from './searchbar';
import CategoryFilter from './categoryfilter';
import "bootstrap/dist/css/bootstrap.min.css";
import countries from '@/utils/countries.json';

interface Recipe {
  id: string;
  name: string;
  image: string;
  countryOfOrigin: string;
  ingredients: string[];
  author: {
    displayName: string;
    email: string;
    uid: string;
  };
}

export default function ListOfRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(countries.map(country => country.name));

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const recipesData: Recipe[] = querySnapshot.docs.map(doc => ({
          ...(doc.data() as Omit<Recipe, 'id'>),
          id: doc.id
        }));
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => (
    (recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) || recipe.ingredients?.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedCategory === '' || recipe.countryOfOrigin === selectedCategory)
  ));

  return (
    <div className="container mt-3">
      <div className="row mb-4">
        <div className="col-lg-6 mb-3 mb-lg-0">
          <SearchBar onSearchChange={setSearchTerm} />
        </div>
        <div className="col-lg-6">
          <CategoryFilter categories={categories} onSelectCategory={setSelectedCategory} />
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {filteredRecipes.map((recipe) => (
          <div className="col" key={recipe.id}>
            <RecipeCard recipe={recipe} variant="addToFavorites" />
          </div>
        ))}
      </div>
    </div>
  );
}