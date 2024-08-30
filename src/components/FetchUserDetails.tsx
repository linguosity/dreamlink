import { createSupabaseServerComponentClient } from "../lib/utils/supabase/server-client";
import DisplayUserDetails from "./DisplayUserDetails";
import NavBar from "./NavBar";
import { DreamItem } from '@/types/dreamAnalysis';

export default async function FetchUserDetails() {
  const supabase = createSupabaseServerComponentClient();
  
  const { data: { session } } = await supabase.auth.getSession();

  let rawDreams: DreamItem[] | null = null;
  let error: any | null = null;

  if (session?.user?.id) {
    const { data, error: queryError } = await supabase
      .from('dream_analyses')
      .select(`
        *,
        dream_tags(tags(*)),
        dream_entries(*),
        verses(*),
        interpretation_elements(*)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    rawDreams = data;
    error = queryError;
  }

  return (
    <>
      <NavBar session={session} />
      <DisplayUserDetails 
        session={session} 
        initialDreams={rawDreams} 
        initialError={error}
      />
    </>
  );
}