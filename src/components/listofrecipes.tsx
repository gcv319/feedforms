import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import RecipeCard from './recipecard';

interface Recipe {
  name: string;
  image: string;
  countryOfOrigin: string;
  displayName: string;
  ingredients: string[]; 
}

export default function ListOfRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const recipesData: Recipe[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const recipe: Recipe = {
            name: data.name,
            image: data.image,
            countryOfOrigin: data.countryOfOrigin,
            displayName: data.author.displayName,
            ingredients: data.ingredients,
          };
          recipesData.push(recipe);
        });
        setRecipes(recipesData);
      } catch (error) {
        console.error('Error fetching recipes: ', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="container">
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {recipes.map((recipe, index) => (
          <div key={index} className="col">
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
}

