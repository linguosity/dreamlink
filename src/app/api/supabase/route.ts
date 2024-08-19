import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic'; // Ensures the route is not statically optimized

export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase.from('profiles').select('*');
  
    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json({ error: 'An error occurred while fetching profiles' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error in Supabase API route:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}