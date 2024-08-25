import { createSupabaseServerClient } from "@/lib/utils/supabase/server-client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to the home page after successful authentication
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}