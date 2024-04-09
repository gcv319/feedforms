import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage, db, auth } from '@/utils/firebase';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Image from 'next/image';

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

interface RecipeCardProps {
  recipe: Recipe;
  variant: 'addToFavorites' | 'deleteRecipe' | 'removeFromFavorites'; // Define the possible variants
}

export default function RecipeCard({ recipe, variant }: RecipeCardProps) {
  const { name, image, countryOfOrigin, author } = recipe;
  const [imageUrl, setImageUrl] = useState<string>('');
  const [alertVisible, setAlertVisible] = useState<boolean>(false); // State to control the visibility of the alert
  const [alertMessage, setAlertMessage] = useState<string>(''); // State to store the alert message
  const [alertType, setAlertType] = useState<string>(''); // State to store the alert type

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
        setAlertMessage('Added to favorites');
        setAlertType('success');
        setAlertVisible(true);
      } else {
        setAlertMessage('Already in favorites');
        setAlertType('info');
        setAlertVisible(true);
      }

      // Hide the alert after 3 seconds (3000 milliseconds)
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to favorites:', error);
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
      setAlertMessage('Recipe deleted successfully');
      setAlertType('success');
      setAlertVisible(true);
      // Invoke some parent callback to refresh the list if necessary
    } catch (error) {
      console.error('Error deleting recipe:', error);
      setAlertMessage('Failed to delete recipe');
      setAlertType('danger');
      setAlertVisible(true);
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
      setAlertMessage('Removed from favorites');
      setAlertType('success');
      setAlertVisible(true);
      // Optionally, invoke some parent callback to refresh the list
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setAlertMessage('Failed to remove from favorites');
      setAlertType('danger');
      setAlertVisible(true);
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
      {alertVisible && (
        <div className={`alert alert-${alertType} position-fixed bottom-0 start-0 m-3`} role="alert">
          {alertMessage}
        </div>
      )}
    </div>
  );
}
