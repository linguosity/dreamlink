import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./lib/utils/supabase/server-client";

export async function middleware(request: NextRequest) {
  // Create a new response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client for this request/response
  const supabase = createSupabaseReqResClient(request, response);

  // Get the user's session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  // Log current path and authentication status for debugging
  console.log('Middleware - Current path:', request.nextUrl.pathname);
  console.log('Middleware - User:', user ? 'Authenticated' : 'Not authenticated');

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/auth/callback', '/auth/auth-error'];

  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // If user is not authenticated and not on a public route, redirect to login
  if (!user && !isPublicRoute) {
    console.log('Middleware - Redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and on the login page, redirect to home
  if (user && request.nextUrl.pathname === '/login') {
    console.log('Middleware - Redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed
  console.log('Middleware - Allowing request to proceed');
  return response;
}

// Configure which routes should be processed by this middleware
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};