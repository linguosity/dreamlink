import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseReqResClient } from "./lib/utils/supabase/server-client";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseReqResClient(request, res);
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    console.log('Middleware - Current path:', request.nextUrl.pathname);
    console.log('Middleware - User:', user ? 'Authenticated' : 'Not authenticated');

    if (!user && request.nextUrl.pathname.startsWith("/account")) {
      console.log('Middleware - Redirecting to home');
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log('Middleware - Allowing request to proceed');
    return res;
  } catch (error) {
    console.error('Middleware - Error:', error);
    return res;
  }
}

export const config = {
  matcher: ["/", "/account/:path*"],
};