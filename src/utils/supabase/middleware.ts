import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const createClient = (request: NextRequest) => {
  console.log("createClient: Creating a new server-side Supabase client");
  console.log("createClient: Request URL:", request.url);

  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  console.log("createClient: Supabase URL:", process.env.SUPABASE_URL);
  console.log("createClient: Supabase Anon Key:", process.env.SUPABASE_ANON_KEY ? "Exists" : "Missing");

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieValue = request.cookies.get(name)?.value;
          console.log(`createClient: Getting cookie "${name}" with value:`, cookieValue);
          return cookieValue;
        },
        set(name: string, value: string, options: CookieOptions) {
          console.log(`createClient: Setting cookie "${name}" with value: ${value} and options:`, options);
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          console.log(`createClient: Removing cookie "${name}" with options:`, options);
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  console.log("createClient: Supabase client and response created");
  return { supabase, response };
};