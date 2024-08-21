"use client";

import { useState, useEffect } from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { User } from '@supabase/supabase-js'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const supabase = useSupabaseClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Error checking user:", error)
      } else if (user) {
        setUser(user)
        router.push('/')
      }
      setIsLoading(false)
    }

    checkUser()
  }, [supabase.auth, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        if (password !== repeatPassword) {
          setError("Passwords don't match");
          return;
        }
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      router.push('/');
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('An error occurred with Google sign-in. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? "Sign In to DreamLink" : "Create a DreamLink Account"}
        </h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Form fields remain the same */}
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