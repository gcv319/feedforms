import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage, db, auth } from '@/utils/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import Image from 'next/image';

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

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
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

  return (
    <div className="card">
      <Image src={imageUrl} className="card-img-top" width={200} height={200} alt={name} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Category: {countryOfOrigin}</p>
        <p className="card-text">Author: {author.displayName}</p>
        <button className="btn btn-primary" onClick={addToFavorites}>
          Add to Favorites
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
