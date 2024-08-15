import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  console.log('Auth callback hit', request.url);
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    console.log('Code received', code);
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Session exchange result', data, error);

    if (error) {
      console.error('Error exchanging code for session', error);
      return NextResponse.redirect(new URL('/login', requestUrl.origin))
    }
  } else {
    console.log('No code received in callback');
  }

  // Add this log
  console.log('Redirecting to home page after successful authentication');
  
  // Redirect to the home page after successful authentication
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}