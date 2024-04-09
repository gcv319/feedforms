'use client'
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import RecipeCard from './recipecard';
import { useAuth } from '@/contexts/authContext'; // Ensure this path is correct

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

export default function ListOfFavorites() {
  const [recipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const { user, initializing } = useAuth(); // Use the useAuth hook to get the user and initializing state

  useEffect(() => {
    console.log('Checking user in ListOfFavorites: ', user, 'Initializing:', initializing);
    if (!initializing && user) { // Check if not initializing and user is present
      const fetchFavoriteRecipes = async () => {
        try {
          const favoritesSnapshot = await getDocs(collection(db, `users/${user.uid}/favorites`));
          const favoriteRecipesData = favoritesSnapshot.docs.map(doc => doc.data() as Recipe);
          setFavoriteRecipes(favoriteRecipesData);
        } catch (error) {
          console.error('Error fetching favorite recipes: ', error);
        }
      };

      fetchFavoriteRecipes();
    } else {
      console.log('Waiting for user to be initialized');
    }
  }, [user, initializing]); // Depend on user and initializing to refetch when these values change
  
  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
}

