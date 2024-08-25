"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginButton({ nextUrl = '/' }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/google');
      const data = await response.json();
      if (data.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    setIsLoading(false);
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Login with Google'}
    </button>
  );
}