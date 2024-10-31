"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "./browser-client";
import { Session } from "@supabase/supabase-js";

export default function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [supabase] = useState(() => createSupabaseBrowserClient());

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return session;
}