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

  console.log('Middleware - Current path:', request.nextUrl.pathname);
  console.log('Middleware - User:', user ? 'Authenticated' : 'Not authenticated');

  const publicRoutes = ['/login', '/auth/callback', '/auth/auth-error'];

  const isPublicRoute = publicRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!user && !isPublicRoute) {
    console.log('Middleware - Redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && request.nextUrl.pathname === '/login') {
    console.log('Middleware - Redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('Middleware - Allowing request to proceed');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};