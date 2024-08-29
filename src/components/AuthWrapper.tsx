"use client";

import { useEffect, useState, ReactNode } from 'react';
import { createSupabaseBrowserClient } from "@/lib/utils/supabase/browser-client";
import LoginCard from "./LoginCard";
import NavBar from "./NavBar";
import { User } from '@supabase/supabase-js';

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) {
    return <LoginCard />;
  }

  return (
    <>
      <NavBar />
      {children}
    </>
  );
}