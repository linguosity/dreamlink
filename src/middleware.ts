import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./lib/utils/supabase/server-client";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createSupabaseReqResClient(request, response);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  // Log current path and authentication status for debugging
  console.log('Middleware - Current path:', request.nextUrl.pathname);
  console.log('Middleware - User:', user ? 'Authenticated' : 'Not authenticated');

  // protects the "/account" route and its sub-routes
  if (!user && request.nextUrl.pathname.startsWith("/account")) {
    console.log('Middleware - Redirecting to home');
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log('Middleware - Allowing request to proceed');
  return response;
}

export const config = {
  matcher: ["/", "/account/:path*"],
};