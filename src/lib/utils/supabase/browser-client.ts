// Import necessary functions and types from Supabase
import { createBrowserClient } from "@supabase/ssr";
import { Database } from './database.types';

// Define a function to create and return a Supabase client for browser environments
export function createSupabaseBrowserClient() {
  console.log("supabase url", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("anon key", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  // Create and return a Supabase client using environment variables
  // The '!' asserts that these environment variables are definitely defined
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}