'use client'
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'; // Import getAuth
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase'; // No need to import auth here
import Navbar from '@/components/navbar';
import "bootstrap/dist/css/bootstrap.min.css";
import ListOfFavorites from '@/components/listoffavorites';

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

export default function Favorites() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    const fetchFavoriteRecipes = async () => {
      try {
        if (!user) {
          console.error('No user signed in.');
          return;
        }
    
        // Fetch user's favorite recipes
        const favoritesSnapshot = await getDocs(collection(db, `users/${user.uid}/favorites`));
        const favoriteRecipesData = favoritesSnapshot.docs.map(doc => doc.data() as Recipe);
        setFavoriteRecipes(favoriteRecipesData);
      } catch (error) {
        console.error('Error fetching favorite recipes: ', error);
      }
    };
    

    fetchFavoriteRecipes();
  }, []);

  return (
    <main>
      <Navbar />
      <ListOfFavorites />
    </main>
  );
}