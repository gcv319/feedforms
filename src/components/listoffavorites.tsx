'use client'
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import RecipeCard from './recipecard';
import { useAuth } from '@/contexts/authContext'; // Ensure this path is correct

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

export default function ListOfFavorites() {
  const [recipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const { user, initializing } = useAuth(); // Use the useAuth hook to get the user and initializing state

  useEffect(() => {
    console.log('Checking user in ListOfFavorites: ', user, 'Initializing:', initializing);
    if (!initializing && user) {
      const fetchFavoriteRecipes = async () => {
        try {
          const favoritesSnapshot = await getDocs(collection(db, `users/${user.uid}/favorites`));
          const favoriteRecipesData = favoritesSnapshot.docs.map(doc => ({
            ...doc.data() as Recipe,
            id: doc.id  // Include the document ID in the object
          }));
          setFavoriteRecipes(favoriteRecipesData);
        } catch (error) {
          console.error('Error fetching favorite recipes: ', error);
        }
      };
  
      fetchFavoriteRecipes();
    } else {
      console.log('Waiting for user to be initialized');
    }
  }, [user, initializing]);
  
  
  return (
    <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} variant='removeFromFavorites' />
      ))}
    </div>
  );
}

