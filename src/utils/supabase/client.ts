import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client should only be used in the browser')
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const fetchSupabaseData = async () => {
  const response = await fetch('/api/supabase');
  if (!response.ok) {
    throw new Error('Failed to fetch data from Supabase');
  }
  return response.json();
};