import { createSupabaseServerClient } from "../lib/utils/supabase/server-client";
import DisplayUserDetails from "./DisplayUserDetails";
import { DreamItem } from '@/types/dreamAnalysis';

export default async function FetchUserDetails() {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      console.log('No session found or error:', sessionError);
      return null;
    }

    // Only fetch user settings
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (settingsError) {
      console.error('Error fetching user settings:', settingsError);
      return null;
    }

    // Fetch dreams
    const { data: dreams, error: dreamError } = await supabase
      .from('dream_analyses')
      .select(`
        *,
        dream_tags (
          tags (
            name
          )
        ),
        interpretation_elements (*),
        verses (*)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (dreamError) {
      console.error('Error fetching dreams:', dreamError);
      return null;
    }

    return (
      <DisplayUserDetails
        session={session}
        initialDreams={dreams || []}
        initialError={null}
        userSettings={userSettings}
      />
    );
    
  } catch (error) {
    console.error('Unexpected error in FetchUserDetails:', error);
    return null;
  }
}
