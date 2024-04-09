"use client"
import React from 'react';
import { useAuth } from '@/contexts/authContext';
import { signOut } from 'firebase/auth';
import { auth } from "@/utils/firebase";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/"><img src="/feedforms-logo.png" width="48px" height="48px"></img>FeedForms</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user && (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/create">Create Recipe</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/favorites">Favorites</a>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
            {!user && (
              <li className="nav-item">
                <a className="nav-link" href="/login">Login</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}