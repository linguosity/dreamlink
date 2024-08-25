// Import necessary types and functions from Next.js and Supabase
import { type NextRequest, type NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { Database } from './database.types';

// Create a Supabase client for server-side use, with optional component flag
export function createSupabaseServerClient(component: boolean = false) {
  // Access all cookies (required for Next.js 13+)
  cookies().getAll();
  
  // Log Supabase URL and Anon Key availability for debugging
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Anon Key set:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  // Create and return a Supabase server client
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Get a cookie
        get(name: string) {
          return getCookie(name, { cookies });
        },
        // Set a cookie (not in server components)
        set(name: string, value: string, options: CookieOptions) {
          if (component) return;
          setCookie(name, value, { cookies, ...options });
        },
        // Remove a cookie (not in server components)
        remove(name: string, options: CookieOptions) {
          if (component) return;
          deleteCookie(name, { cookies, ...options });
        },
      },
    }
  );
}

// Create a Supabase client specifically for server components
export function createSupabaseServerComponentClient() {
  // Access all cookies
  cookies().getAll();
  
  // Log Supabase URL and Anon Key availability for debugging
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set');
  
  // Create a server client with component flag set to true
  return createSupabaseServerClient(true);
}

// Create a Supabase client for use in API routes (with request and response objects)
export function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse
) {
  // Access all cookies
  cookies().getAll();
  
  // Create and return a Supabase server client for API routes
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Get a cookie
        get(name: string) {
          return getCookie(name, { req, res });
        },
        // Set a cookie
        set(name: string, value: string, options: CookieOptions) {
          setCookie(name, value, { req, res, ...options });
        },
        // Remove a cookie by setting empty value
        remove(name: string, options: CookieOptions) {
          setCookie(name, "", { req, res, ...options });
        },
      },
    }
  );
}