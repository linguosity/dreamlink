"use client";

import { useState, useEffect } from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      console.log("LoginPage: Checking session state");
      const { data: { session } } = await supabase.auth.getSession();
      console.log('LoginPage: Current session state:', session ? 'Logged in' : 'Not logged in');
      if (session) {
        console.log("LoginPage: Session exists, redirecting to home");
        router.push('/');
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        console.log('LoginPage: Attempting to sign in...');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setError('Please confirm your email address before signing in.');
          } else {
            throw new Error(error.message);
          }
        } else {
          console.log('LoginPage: Sign in successful, redirecting to home...');
          router.push('/');
        }
      } else {
        if (password !== repeatPassword) {
          setError("Passwords don't match");
          return;
        }
        console.log('LoginPage: Attempting to sign up...');
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          throw new Error(error.message);
        }
        console.log('LoginPage: Sign up successful, redirecting to home...');
        router.push('/');
      }
    } catch (error) {
      console.error('LoginPage: Authentication error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('LoginPage: Initiating Google Sign-In');
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw new Error(error.message);
    } catch (error) {
      console.error('LoginPage: Google sign-in error:', error);
      setError('An error occurred with Google sign-in. Please try again.');
    }
  };

  console.log("LoginPage: Rendering login page");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Sign In to DreamLink" : "Create a DreamLink Account"}
        </h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email" value="Your email" />
            <TextInput 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password" value="Your password" />
            <TextInput 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!isLogin && (
            <div>
              <Label htmlFor="repeat-password" value="Repeat password" />
              <TextInput 
                id="repeat-password" 
                type="password" 
                required 
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
            </div>
          )}
          {isLogin && (
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Remember me</Label>
            </div>
          )}
          {!isLogin && (
            <div className="flex items-center gap-2">
              <Checkbox id="agree" />
              <Label htmlFor="agree" className="flex">
                I agree with the&nbsp;
                <Link href="#" className="text-cyan-600 hover:underline dark:text-cyan-500">
                  terms and conditions
                </Link>
              </Label>
            </div>
          )}
          <Button color="light" type="submit">{isLogin ? "Sign In" : "Register"}</Button>
        </form>
        <div className="mt-4">
          <Button color="light" className="w-full" onClick={handleGoogleSignIn}>
            Sign in with Google
          </Button>
        </div>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-cyan-600 hover:underline dark:text-cyan-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
