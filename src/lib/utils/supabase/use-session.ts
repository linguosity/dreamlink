"use client"; // Indicates that this is a client-side component

// Import necessary hooks and functions
import { useEffect, useState } from "react";
import { createSupabaseClient } from "./browser-client";
import { Session } from "@supabase/supabase-js";

// Custom hook to manage Supabase session
export default function useSession() {
  // State to store the current session
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Create a Supabase client for browser use
    const supabase = createSupabaseClient();

    // Async function to fetch the current session
    const getSession = async () => {
      // Retrieve the session from Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Update the session state
      setSession(session);
    };

    // Call getSession when the component mounts
    getSession();
  }, []); // Empty dependency array means this effect runs once on mount

  // Return the current session
  return session;
}