import { type NextRequest, type NextResponse } from "next/server";
import { headers } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function createSupabaseServerClient(component: boolean = false) {
  // Fix Error 2: Await the headers
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Fix Error 3: Add type for 'c'
          const cookie = cookieHeader
            .split(';')
            .find((c: string) => c.trim().startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : undefined;
        },
        set(name: string, value: string, options: CookieOptions) {
          if (component) return;
        },
        remove(name: string, options: CookieOptions) {
          if (component) return;
        },
      },
    }
  );
}

export async function createSupabaseServerComponentClient() {
  return createSupabaseServerClient(true);
}

export async function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse
) {
  // Fix Error 4: Use headers instead of cookies
  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieHeader
            .split(';')
            .find((c: string) => c.trim().startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : undefined;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Implementation for setting cookies
        },
        remove(name: string, options: CookieOptions) {
          // Implementation for removing cookies
        },
      },
    }
  );
}
