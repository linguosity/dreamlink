import { createSupabaseServerComponentClient } from "../lib/utils/supabase/server-client";
import DetailsButtonClient from "./DetailsButtonClient";

export default async function DetailsButtonServer() {
  const supabase = createSupabaseServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();

  let rawDreams = null;
  let error = null;

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

  return <DetailsButtonClient session={session} rawDreams={rawDreams} error={error} />;
}