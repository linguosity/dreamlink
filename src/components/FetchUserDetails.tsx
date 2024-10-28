import { createSupabaseServerClient } from "../lib/utils/supabase/server-client";
import DisplayUserDetails from "./DisplayUserDetails";
import { DreamItem } from '@/types/dreamAnalysis';

export default async function FetchUserDetails() {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return null;
    }

    if (!session?.user) {
      console.log('No session found');
      return null;
    }

    // Add this near the top of the function
    console.log('Session user ID:', session?.user?.id);
    console.log('Session:', JSON.stringify(session, null, 2));

    // Fetch user details
    const { data: userDetails, error: userError } = await supabase
      .from('user_details')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user details:', userError.message, userError);
      return null;
    }

    if (!userDetails) {
      console.log('No user details found for id:', session.user.id);
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
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (dreamError) {
      console.error('Error fetching dreams:', dreamError.message, dreamError);
      return null;
    }

    return (
      <DisplayUserDetails
        session={session}
        initialDreams={dreams}
        initialError={null}
        userDetails={userDetails} // Add this if needed by DisplayUserDetails
      />
    );
    
  } catch (error) {
    console.error('Unexpected error in FetchUserDetails:', error);
    return null;
  }
}
