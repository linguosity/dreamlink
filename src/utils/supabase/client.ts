import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createClient = () => {
  console.log('Creating Supabase client with URL:', process.env.SUPABASE_URL);
  console.log('Anon Key available:', !!process.env.SUPABASE_ANON_KEY);

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
  }

  return createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )
}