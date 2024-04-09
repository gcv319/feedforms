import React from 'react';
import ListOfRecipes from "@/components/listofrecipes";
import Navbar from "@/components/navbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  return (
    <main>
      <Navbar />
      <ListOfRecipes />
    </main>
  );
};
