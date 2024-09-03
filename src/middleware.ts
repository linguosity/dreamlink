import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./lib/utils/supabase/server-client";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseReqResClient(request, res);
  const { data: { session } } = await supabase.auth.getSession();

  // Paths that should be accessible only to authenticated users
  const protectedPaths = ['/'];

  // Check if the user is trying to access a protected path
  const isAccessingProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Allow access to auth callback route for OAuth flow
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return res; // Let the callback route process the OAuth response
  }

  if (!session && isAccessingProtectedPath && request.nextUrl.pathname !== '/login') {
    // Redirect to login if trying to access a protected path without a session
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (session && request.nextUrl.pathname === '/login') {
    // Redirect to home if already logged in and trying to access login page
    return NextResponse.redirect(new URL('/', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|fonts|images).*)'],
};


