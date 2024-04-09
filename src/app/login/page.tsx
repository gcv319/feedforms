"use client"
import React, { useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { handleGoogleSignIn } from "@/utils/utils";
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.emailInput.value;
    const password = form.passwordInput.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in with:', userCredential.user);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await handleGoogleSignIn();
      router.push('/');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <main className="container my-5">
      <h1 className="text-center mb-4">FeedForms</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">Email address</label>
              <input type="email" className="form-control" id="emailInput" name="emailInput" placeholder="name@example.com" />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">Password</label>
              <input type="password" className="form-control" id="passwordInput" name="passwordInput" placeholder="Password" />
            </div>
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
          <hr className="my-4" />
          <div className="d-grid gap-2">
            <button type="button" className="btn btn-danger" onClick={handleGoogleLogin}>Login with Google</button>
          </div>
          <div className="text-center mt-3">
            <a href="/signup" className="text-decoration-none">Don't have an account? Click here!</a>
          </div>
        </div>
      </div>
    </main>
  );
}