import { createSupabaseServerComponentClient } from '@/lib/utils/supabase/server-client';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = createSupabaseServerComponentClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}