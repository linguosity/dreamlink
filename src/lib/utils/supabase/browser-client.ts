// Import necessary functions and types from Supabase
import { createBrowserClient } from '@supabase/ssr'

// Define a function to create and return a Supabase client for browser environments
export function createSupabaseBrowserClient() {
  // Create and return a Supabase client using environment variables
  // The '!' asserts that these environment variables are definitely defined
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}