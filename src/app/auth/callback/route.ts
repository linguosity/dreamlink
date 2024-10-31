import { createSupabaseServerClient } from "@/lib/utils/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to the home page after successful authentication
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
}
