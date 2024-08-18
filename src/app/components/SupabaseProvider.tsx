'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';

const SupabaseContext = createContext<{ supabase: SupabaseClient | null; session: Session | null }>({
  supabase: null,
  session: null,
});

// In your SupabaseProvider.tsx
export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
      throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context as { supabase: SupabaseClient, session: Session | null };
  };

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const loadSupabase = async () => {
      const { createBrowserClient } = await import('@supabase/ssr');
      const supabaseClient = createBrowserClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );
      setSupabase(supabaseClient);

      const { data: { session } } = await supabaseClient.auth.getSession();
      setSession(session);
    };

    loadSupabase();
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  );
}