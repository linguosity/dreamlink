import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // This line is crucial

export async function GET() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return NextResponse.json(session)
}