import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import RecipeCard from './recipecard';
import SearchBar from './searchbar';
import CategoryFilter from './categoryfilter';
import { useAuth } from '@/contexts/authContext';
import "bootstrap/dist/css/bootstrap.min.css";
import countriesData from '@/utils/countries.json';

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

export default function ListOfFavorites() {
  const [recipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { user, initializing } = useAuth();

  useEffect(() => {
    fetchFavoriteRecipes();
  }, [user, initializing]);

  const fetchFavoriteRecipes = async () => {
    if (user) {
      try {
        const favoritesSnapshot = await getDocs(collection(db, `users/${user.uid}/favorites`));
        const favoriteRecipesData = favoritesSnapshot.docs.map(doc => ({
          ...doc.data() as Recipe,
          id: doc.id
        }));
        setFavoriteRecipes(favoriteRecipesData);
      } catch (error) {
        console.error('Error fetching favorite recipes: ', error);
      }
    }
  };

  const filteredRecipes = recipes.filter((recipe) => (
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || recipe.countryOfOrigin === selectedCategory)
  ));

  const categories = countriesData.map(country => country.name);

  return (
    <div className="container mt-3">
      <div className="row mb-3">
        <div className="col">
          <SearchBar onSearchChange={setSearchTerm} />
        </div>
        <div className="col">
          <CategoryFilter categories={categories} onSelectCategory={setSelectedCategory} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} variant='removeFromFavorites' fetchFavoriteRecipes={fetchFavoriteRecipes} />
        ))}
      </div>
    </div>
  );
}