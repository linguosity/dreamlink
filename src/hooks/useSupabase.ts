import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { SupabaseClient } from '@supabase/supabase-js'

export function useSupabase(): SupabaseClient {
  const supabase = useSupabaseClient()
  return supabase
}