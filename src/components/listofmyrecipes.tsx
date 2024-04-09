import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { useAuth } from '@/contexts/authContext'; // Import your useAuth hook
import RecipeCard from './recipecard';
import "bootstrap/dist/css/bootstrap.min.css";

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

export default function ListOfMyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { user, initializing } = useAuth(); // Use the useAuth hook to get the current user

  useEffect(() => {
    if (!initializing && user) {
      const fetchRecipes = async () => {
        try {
          const q = collection(db, 'recipes');
          const querySnapshot = await getDocs(q);
          const recipesData: Recipe[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data() as Recipe;
            if (data.author.uid === user.uid) { // Check if the recipe belongs to the current user
              recipesData.push({ ...data, id: doc.id }); // Add id here
            }
          });
          setRecipes(recipesData);
        } catch (error) {
          console.error('Error fetching my recipes: ', error);
        }
      };

      fetchRecipes();
    }
  }, [user, initializing]);

  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} variant='deleteRecipe' />
      ))}
    </div>
  );
}



