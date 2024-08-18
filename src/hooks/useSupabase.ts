import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { SupabaseClient, Session } from '@supabase/supabase-js';

export function useSupabase(): { supabase: SupabaseClient, session: Session | null } {
  const supabase = useSupabaseClient();
  const session = useSession();
  return { supabase, session };
}
