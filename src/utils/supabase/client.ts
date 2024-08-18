import { createClient } from '@supabase/supabase-js'

export const fetchSupabaseData = async () => {
  const response = await fetch('/api/supabase');
  if (!response.ok) {
    throw new Error('Failed to fetch data from Supabase');
  }
  return response.json();
};