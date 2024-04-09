'use client'
import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage, db, auth } from '@/utils/firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Image from 'next/image';
import Alert from './alert';
import { useRouter } from 'next/navigation';

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

interface RecipeCardProps {
  recipe: Recipe;
  variant: 'addToFavorites' | 'deleteRecipe' | 'removeFromFavorites'; // Define the possible variants
  fetchFavoriteRecipes?: () => void;
  fetchRecipes?: () => void;
}

export default function RecipeCard({ recipe, variant, fetchFavoriteRecipes, fetchRecipes }: RecipeCardProps) {
  const { name, image, countryOfOrigin, author } = recipe;
  const [imageUrl, setImageUrl] = useState<string>('');
  const [alert, setAlert] = useState({ message: '', type: '', visible: false });

  const router = useRouter();

  useEffect(() => {
    const getImageUrl = async () => {
      try {
        const storageRef = ref(storage, image);
        const url = await getDownloadURL(storageRef);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    getImageUrl();
  }, [image]);

  // Function that determines what to do based on the variant
  const handleButtonClick = () => {
    if (variant === 'addToFavorites') {
      addToFavorites();
    } else if (variant === 'deleteRecipe') {
      deleteRecipe();
    } else if (variant === 'removeFromFavorites') {
      removeFromFavorites();
    }
  };

  // Determine button text based on variant
  const buttonText = variant === 'addToFavorites' ? 'Add to Favorites' :
    variant === 'deleteRecipe' ? 'Delete Recipe' :
      'Remove';

  // Update this function to use the Alert component
  const showCustomAlert = (message: string, type: 'success' | 'danger' | 'warning' | 'info') => {
    setAlert({ message, type, visible: true });
    setTimeout(() => setAlert({ message: '', type: '', visible: false }), 3000);
  };

  const addToFavorites = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No user signed in.');
        return;
      }

      // Check if the recipe is already favorited by the user
      const favoritesQuery = query(collection(db, `users/${currentUser.uid}/favorites`), where('name', '==', name));
      const favoritesSnapshot = await getDocs(favoritesQuery);

      if (favoritesSnapshot.empty) {
        await addDoc(collection(db, `users/${currentUser.uid}/favorites`), {
          name,
          image,
          countryOfOrigin,
          author,
        });
        showCustomAlert('Added to favorites', 'success');
      } else {
        showCustomAlert('Already in favorites', 'info');
      }
    } catch (error) {
      showCustomAlert('Error adding to favorites', 'danger');
    }
  };

  const deleteRecipe = async () => {
    console.log('recipe id: ', recipe.id);
    if (!recipe.id) {
      console.error('Recipe ID is undefined.');
      return;
    }
    try {
      await deleteDoc(doc(db, 'recipes', recipe.id));
      showCustomAlert('Recipe deleted successfully', 'success');
      if (fetchRecipes) {
        setTimeout(() => fetchRecipes(), 2000);
      }
    } catch (error) {
      showCustomAlert('Failed to delete recipe', 'danger');
    }
  };

  const removeFromFavorites = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No user signed in.');
        return;
      }
      const favoriteRef = doc(db, `users/${currentUser.uid}/favorites`, recipe.id);
      await deleteDoc(favoriteRef);
      showCustomAlert('Removed from favorites', 'success');
      if (fetchFavoriteRecipes) {
        setTimeout(() => fetchFavoriteRecipes(), 2000);
      }
    } catch (error) {
      showCustomAlert('Failed to remove from favorites', 'danger');
    }
  };

  return (
    <div className="card">
      <Image src={imageUrl} className="card-img-top" width={200} height={200} alt={name} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Category: {countryOfOrigin}</p>
        <p className="card-text">Author: {author.displayName}</p>
        <button className="btn btn-primary" onClick={handleButtonClick}>
          {buttonText}
        </button>
      </div>
      {alert.visible && (
        <Alert
          message={alert.message}
          type={alert.type}
          visible={alert.visible}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}
    </div>
  );
}
