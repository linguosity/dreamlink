// components/NavBar.tsx
import { createSupabaseServerComponentClient } from "../lib/utils/supabase/server-client";
import ClientNavBar from "./ClientNavBar";
import { UserProfile } from "../types/user";

export default async function NavBar() {
  const supabase = createSupabaseServerComponentClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Log the session and user profile for debugging
  console.log('Session in NavBar:', session);

  let userProfile: UserProfile | null = null;

  if (session && session.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      userProfile = {
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        email: session.user.email as string// This should always be available
      };
    }
  }

  return <ClientNavBar user={userProfile} />;
}