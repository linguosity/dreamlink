// Import necessary types and functions from Next.js and Supabase
import { type NextRequest, type NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { Database } from './database.types'; // Import the generated Database types

// Create a Supabase client for server-side use, with optional component flag
export function createSupabaseServerClient(component: boolean = false) {
  cookies().getAll(); // Access all cookies (required for Next.js 13+)
  return createServerClient<Database>(  // Add <Database> generic type here
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase project URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Supabase anonymous key
    {
      cookies: {
        // Custom cookie handling functions
        get(name: string) {
          return getCookie(name, { cookies }); // Get a cookie
        },
        set(name: string, value: string, options: CookieOptions) {
          if (component) return; // Don't set cookies in server components
          setCookie(name, value, { cookies, ...options }); // Set a cookie
        },
        remove(name: string, options: CookieOptions) {
          if (component) return; // Don't remove cookies in server components
          deleteCookie(name, { cookies, ...options }); // Remove a cookie
        },
      },
    }
  );
}

// Create a Supabase client specifically for server components
export function createSupabaseServerComponentClient() {
  cookies().getAll(); // Access all cookies
  return createSupabaseServerClient(true); // Create client with component flag
}

// Create a Supabase client for use in API routes (with request and response objects)
export function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse
) {
  cookies().getAll(); // Access all cookies
  return createServerClient<Database>(  // Add <Database> generic type here
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase project URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Supabase anonymous key
    {
      cookies: {
        // Custom cookie handling functions for API routes
        get(name: string) {
          return getCookie(name, { req, res }); // Get a cookie
        },
        set(name: string, value: string, options: CookieOptions) {
          setCookie(name, value, { req, res, ...options }); // Set a cookie
        },
        remove(name: string, options: CookieOptions) {
          setCookie(name, "", { req, res, ...options }); // Remove a cookie by setting empty value
        },
      },
    }
  );
}
