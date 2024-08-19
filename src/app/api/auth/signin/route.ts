import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log('Attempting to sign in user:', email)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.error('Sign-in error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('User signed in successfully:', email)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error during sign-in:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}