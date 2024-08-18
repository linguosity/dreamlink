'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => {
    console.log("SupabaseProvider: Initializing Supabase client");
    
    // Log the environment variables to confirm they are set
    console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
    console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "Exists" : "Missing");

    return createClient();
  });

  console.log("SupabaseProvider: Rendering with children");

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {children}
    </SessionContextProvider>
  );
}
