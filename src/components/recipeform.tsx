'use client'
import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '@/utils/firebase';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

import ingredientsData from '@/utils/ingredients.json';
import countriesData from '@/utils/countries.json';

export default function RecipeForm() {
  const [name, setName] = useState<string>('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null); 
  const [imageUrl, setImageUrl] = useState<string>('');
  const [countryOfOrigin, setCountryOfOrigin] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (user && image) {
        const storageRef = ref(storage, `${user.uid}/${image.name}`);
        await uploadBytes(storageRef, image);

        const imageUrl = await getDownloadURL(storageRef);

        // Add recipe data to Firestore
        const docRef = await addDoc(collection(db, 'recipes'), {
          name,
          ingredients,
          image: imageUrl, // Set image URL
          countryOfOrigin,
          author: {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
          },
        });

        console.log('Document written with ID: ', docRef.id);

        router.push("/");
      } else {
        console.error('No user signed in or no image selected.');
      }
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Recipe Name:</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="ingredients" className="form-label">Ingredients:</label>
        <div className="row row-cols-3">
          {ingredientsData.ingredients.map((ingredient, index) => (
            <div key={index} className="col"> 
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`ingredient-${index}`}
                  value={ingredient}
                  checked={ingredients.includes(ingredient)}
                  onChange={(e) => {
                    const selectedIngredient = e.target.value;
                    if (e.target.checked) {
                      setIngredients([...ingredients, selectedIngredient]);
                    } else {
                      setIngredients(ingredients.filter((item) => item !== selectedIngredient));
                    }
                  }}
                />
                <label className="form-check-label" htmlFor={`ingredient-${index}`}>
                  {ingredient}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="image" className="form-label">Image:</label>
        <input
          type="file"
          className="form-control"
          id="image"
          accept="image/*"
          onChange={(e) => setImage(e.target.files![0])} // Store the File object
        />
      </div>

      <div className="mb-3">
        <label htmlFor="countryOfOrigin" className="form-label">Country of Origin:</label>
        <select
          id="countryOfOrigin"
          className="form-select"
          value={countryOfOrigin}
          onChange={(e) => setCountryOfOrigin(e.target.value)}
        >
          {countriesData.map((country, index) => (
            <option key={index} value={country.name}>{country.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
}
