// Import necessary functions and types
import { createSupabaseServerClient } from "@/lib/utils/supabase/server-client";
import { NextResponse } from "next/server";

// Handler for GET requests to this route
export async function GET(request: Request) {
  // Parse the request URL
  const { searchParams, origin } = new URL(request.url);
  
  // Extract the authorization code from URL parameters
  const code = searchParams.get("code");
  
  // Get the 'next' parameter for redirect, default to home if not provided
  const next = searchParams.get("next") ?? "/";

  // If an authorization code is present
  if (code) {
    // Create a Supabase server client
    const supabase = createSupabaseServerClient();
    
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    // If exchange is successful, redirect to the specified 'next' URL
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If code is missing or exchange fails, redirect to an error page
  // TODO: Create this error page
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}