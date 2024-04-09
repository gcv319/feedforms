import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import RecipeCard from './recipecard';

// Define the Recipe interface once, outside of the component
interface Recipe {
  id: string;
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
        const recipesData: Recipe[] = querySnapshot.docs.map(doc => {
          const docData = doc.data() as Omit<Recipe, 'id'>; // Exclude 'id' from the data type if it's not part of the stored data
          return {
            ...docData, // Spread the document data first
            id: doc.id // Then set the 'id', so it won't be overwritten
          };
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
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} variant="addToFavorites" />
      ))}
    </div>
  );
}
