"use client"
import ListOfMyRecipes from '@/components/listofmyrecipes'
import Navbar from '@/components/navbar'
import React from 'react'

export default function MyRecipes() {
  return (
    <main>
      <Navbar />
      <ListOfMyRecipes />
    </main>
  )
}
