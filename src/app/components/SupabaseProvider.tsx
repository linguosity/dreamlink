'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => {
    console.log("SupabaseProvider: Initializing Supabase client for non-sensitive operations");
    try {
      return createClient();
    } catch (error) {
      console.error("Error creating Supabase client:", error);
      return null;
    }
  });

  if (!supabase) {
    return <div>Error initializing Supabase client. Check the console for more details.</div>;
  }

  console.log("SupabaseProvider: Rendering with children");

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}