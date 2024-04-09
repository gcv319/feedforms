import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useAuth } from '@/contexts/authContext'; // Import your useAuth hook
import RecipeCard from './recipecard';
import SearchBar from './searchbar'; // Assuming you have this component
import CategoryFilter from './categoryfilter'; // Assuming you have this component
import "bootstrap/dist/css/bootstrap.min.css";
import countriesData from '@/utils/countries.json'; // Import your countries data

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

export default function ListOfMyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { user, initializing } = useAuth(); // Use the useAuth hook to get the current user

  useEffect(() => {
    fetchRecipes();
  }, [user, initializing]);

  const fetchRecipes = async () => {
    if (user) {
      try {
        const q = query(collection(db, 'recipes'), where('author.uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const recipesData: Recipe[] = querySnapshot.docs.map(doc => ({
          ...(doc.data() as Recipe),
          id: doc.id
        }));
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching my recipes: ', error);
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
          <RecipeCard key={recipe.id} recipe={recipe} variant='deleteRecipe' fetchRecipes={fetchRecipes} />
        ))}
      </div>
    </div>
  );
}




