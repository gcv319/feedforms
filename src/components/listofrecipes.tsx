import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import RecipeCard from './recipecard';

interface Recipe {
  name: string;
  image: string;
  countryOfOrigin: string;
  author: {
    displayName: string;
    email: string;
    uid: string;
  };
}

export default function ListOfRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const recipesData: Recipe[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Recipe;
          recipesData.push(data);
        });
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
}