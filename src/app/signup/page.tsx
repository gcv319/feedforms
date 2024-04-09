"use client"
import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "@/utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { handleGoogleSignIn } from "@/utils/utils";
import { useRouter } from 'next/navigation';

export default function Signup() {
  const router = useRouter();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.emailInput.value;
    const password = form.passwordInput.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up with:', userCredential.user);
      router.push('/');
    } catch (error) {
      console.error('Signup error:', error);
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
          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">Email address</label>
              <input type="email" className="form-control" id="emailInput" name="emailInput" placeholder="name@example.com" />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">Password</label>
              <input type="password" className="form-control" id="passwordInput" name="passwordInput" placeholder="Password" />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
              <input type="password" className="form-control" id="confirmPasswordInput" name="confirmPasswordInput" placeholder="Confirm Password" />
            </div>
            <div className="d-grid gap-2 mb-3">
              <button type="submit" className="btn btn-primary">Sign up</button>
            </div>
          </form>
          <div className="d-grid gap-2">
            <button type="button" className="btn btn-danger" onClick={handleGoogleLogin}>Sign up with Google</button>
          </div>
          <div className="text-center mt-3">
            <a href="/login" className="text-decoration-none">Already have an account? Login here!</a>
          </div>
        </div>
      </div>
    </main>
  );
}