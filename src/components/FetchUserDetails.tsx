'use client';

import { createSupabaseBrowserClient } from "../lib/utils/supabase/browser-client";
import DisplayUserDetails from "./DisplayUserDetails";
import { useEffect, useState } from "react";
import useSession from "../lib/utils/supabase/use-session";
import { DreamItem } from '@/types/dreamAnalysis';
import { UserSettings } from '@/types/userSettings';

export default function FetchUserDetails() {
  const session = useSession();
  const [dreams, setDreams] = useState<DreamItem[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (!session?.user) return;

    async function fetchData() {
      try {
        // Fetch user settings
        const { data: settings, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', session?.user?.id || '')
          .single();

        if (settingsError) throw settingsError;
        setUserSettings(settings as UserSettings);

        // Fetch dreams
        const { data: dreamData, error: dreamError } = await supabase
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
          .eq('user_id', session?.user?.id || '')
          .order('created_at', { ascending: false });

        if (dreamError) throw dreamError;
        setDreams(dreamData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    }

    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel('dream_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dream_analyses',
          filter: `user_id=eq.${session.user.id}`
        },
        () => {
          fetchData(); // Refetch all data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, supabase]);

  if (!session) return null;

  return (
    <DisplayUserDetails
      session={session}
      initialDreams={dreams}
      initialError={error?.message || null}
      userSettings={{
        bible_version: userSettings?.bible_version || '',
        created_at: userSettings?.created_at || '',
        language: userSettings?.language || '',
        updated_at: userSettings?.updated_at || '',
        user_id: userSettings?.user_id || ''
      }}
    />
  );
}
