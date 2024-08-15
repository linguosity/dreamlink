import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  console.log('Middleware: Intercepting request for path:', request.nextUrl.pathname);
  console.log('Middleware: Full request URL:', request.url);

  const { supabase, response } = createClient(request);

  console.log('Middleware: Checking auth state...');
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error('Middleware: Error getting session:', error);
  }

  console.log('Middleware: Session state:', session ? 'Exists' : 'Does not exist');

  if (!session && request.nextUrl.pathname !== '/login' && request.nextUrl.pathname !== '/auth/callback') {
    console.log('Middleware: No session, redirecting to login');
    console.log('Middleware: Redirect URL:', new URL('/login', request.url).toString());
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && request.nextUrl.pathname === '/login') {
    console.log('Middleware: Session exists, redirecting to home');
    console.log('Middleware: Redirect URL:', new URL('/', request.url).toString());
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('Middleware: Proceeding with the request');
  console.log('Middleware: Response headers:', JSON.stringify(response.headers));
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};