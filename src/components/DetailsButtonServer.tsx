import { createSupabaseServerComponentClient } from "../lib/utils/supabase/server-client";
import DetailsButtonClient from "../components/DetailsButtonClient"

export default async function DetailsButtonServer() {
  const {
    data: { session },
    error,
  } = await createSupabaseServerComponentClient().auth.getSession();

  return <DetailsButtonClient session={session} />;
}