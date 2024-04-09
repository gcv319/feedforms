import React, { useState, useEffect } from 'react';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/firebase';

interface Recipe {
  name: string;
  image: string;
  countryOfOrigin: string;
  displayName: string;
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { name, image, countryOfOrigin, displayName } = recipe;
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // Function to fetch image URL from Firebase Storage
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
  }, []);
  

  return (
    <div className="card">
      <img src={imageUrl} className="card-img-top" alt={name} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">Category: {countryOfOrigin}</p>
        <p className="card-text">Author: {displayName}</p>
      </div>
    </div>
  );
}
