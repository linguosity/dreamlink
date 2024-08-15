"use client"

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => {
    console.log("SupabaseProvider: Initializing Supabase client");
    return createClient();
  });

  console.log("SupabaseProvider: Rendering with children");

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}
