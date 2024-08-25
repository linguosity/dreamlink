"use client";

import { Button } from 'flowbite-react';
import { createSupabaseClient} from "../lib/utils/supabase/browser-client";

export default function LoginButton(props: { nextUrl?: string }) {
  const supabase = createSupabaseClient();

  const handleLogin = async () => {
    try {
      console.log('Initiating Google sign-in...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      console.log('Sign-in attempt result:', { data, error });
  
      if (error) {
        throw error;
      }
  
      console.log('Sign-in successful, redirecting...');
    } catch (error) {
      console.error('Detailed sign-in error:', error);
      alert('An error occurred during sign-in. Please try again.');
    }
  };

  return (
    <Button onClick={handleLogin} color="blue" className="w-full">
      Google
    </Button>
  );
}