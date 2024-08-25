import { createSupabaseServerComponentClient } from "../lib/utils/supabase/server-client";
import DetailsButtonClient from "../components/DetailsButtonClient"

export default async function DetailsButtonServer() {
  const supabase = createSupabaseServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();

  return <DetailsButtonClient session={session} />;
}