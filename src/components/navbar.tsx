"use client"
import React from 'react';
import { useAuth } from '@/contexts/authContext';
import { signOut } from 'firebase/auth';
import { auth } from "@/utils/firebase";

export default function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">FeedForms</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {user ? (
                <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
              ) : (
                <a className="nav-link" href="/login">Login</a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
