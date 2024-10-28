import { type NextRequest, type NextResponse } from "next/server";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function createSupabaseServerClient(component: boolean = false) {
  (cookies() as unknown as UnsafeUnwrappedCookies).getAll();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return getCookie(name, { cookies });
        },
        set(name: string, value: string, options: CookieOptions) {
          if (component) return;
          setCookie(name, value, { cookies, ...options });
        },
        remove(name: string, options: CookieOptions) {
          if (component) return;
          deleteCookie(name, { cookies, ...options });
        },
      },
    }
  );
}

export function createSupabaseServerComponentClient() {
  (cookies() as unknown as UnsafeUnwrappedCookies).getAll();
  return createSupabaseServerClient(true);
}

export function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse
) {
  (cookies() as unknown as UnsafeUnwrappedCookies).getAll();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return getCookie(name, { req, res });
        },
        set(name: string, value: string, options: CookieOptions) {
          setCookie(name, value, { req, res, ...options });
        },
        remove(name: string, options: CookieOptions) {
          setCookie(name, "", { req, res, ...options });
        },
      },
    }
  );
}