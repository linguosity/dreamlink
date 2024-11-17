"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from "@/lib/utils/supabase/browser-client";
import { Card, Button, Label, TextInput, Alert } from 'flowbite-react';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setError('Account created successfully. You can now sign in.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Starting Google login flow...');
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    console.log('Google login response:', { error, data });
    if (error) {
      console.error('Google login error:', error);
      setError(error.message);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <span 
            className="self-center text-2xl font-semibold whitespace-nowrap text-black dark:text-white"
            style={{ fontFamily: 'Blanka, sans-serif' }}>
                DreamLink
      </span>
      {error && (
        <Alert color="failure" className="mt-2">
          {error}
        </Alert>
      )}
      <form className="flex flex-col gap-4" onSubmit={handleAuthSubmit}>
        <div>
          <Label htmlFor="email" value="Your email" />
          <TextInput
            id="email"
            type="email"
            placeholder="name@flowbite.com"
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
        <Button type="submit" color="light">
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
      <div className="mt-4">
        <Button onClick={handleGoogleLogin} className="w-full" color="blue">
          Sign in with Google
        </Button>
      </div>
      <p className="mt-4 text-sm text-center">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:underline"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </Card>
  );
}
