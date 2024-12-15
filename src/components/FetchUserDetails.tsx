'use client';

import { createSupabaseBrowserClient } from "../lib/utils/supabase/browser-client";
import DisplayUserDetails from "./DisplayUserDetails";
import DreamInputWrapper from "./DreamInputWrapper";
import NavbarSearch from "./NavBarSearch"; // Import your search component directly
import { useEffect, useState } from "react";
import useSession from "../lib/utils/supabase/use-session";
import { DreamItem } from '@/types/dreamAnalysis';
import { UserSettings } from '@/types/userSettings';

export default function FetchUserDetails() {
  const session = useSession();
  const [dreams, setDreams] = useState<DreamItem[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  const [selectedTag, setSelectedTag] = useState<string>('All Tags');
  const [searchResults, setSearchResults] = useState<DreamItem[]>([]);

  const user = session?.user;

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!user) return;
      try {
        setLoading(true);
        console.log('Fetching data for user:', user.id);

        // Fetch user settings
        const { data: settings, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
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
          .eq('user_id', user?.id || '')
          .order('created_at', { ascending: false });

        if (dreamError) throw dreamError;
        if (mounted) {
          setDreams(dreamData || []);
          setLoading(false);
        }

        console.log('Fetched dream data:', dreamData);
      } catch (err) {
        console.error('Error in fetchData:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setLoading(false);
        }
      }
    }

    fetchData();

    // Real-time subscription to changes
    const channel = supabase
      .channel('dream_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dream_analyses', filter: `user_id=eq.${user?.id}` }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dream_tags' }, () => fetchData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tags' }, () => fetchData())
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id, supabase]);

  if (loading) return <div>Loading...</div>;
  if (!session) return null;
  if (error) return <div>Error: {error.message}</div>;

  const handleSearch = (results: DreamItem[]) => {
    setSearchResults(results);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
  };

  const handleAddDream = (newDream: DreamItem) => {
    setDreams(prev => [newDream, ...prev]);
  };

  return (
    <div className="pt-12">
      {session && (
        <>
          {/* One row, two columns: left = Dream input, right = Search */}
          <div className="grid grid-cols-2 gap-4 items-center px-4">
            {/* Left column: "Share your dream journey" */}
            <DreamInputWrapper userId={session.user.id} onAddDream={handleAddDream} />

            {/* Right column: Search + Tag dropdown */}
            <NavbarSearch
              session={session}
              onSearch={handleSearch}
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
            />
          </div>

          {/* Display the results */}
          <div className="mt-2 px-4">
            <DisplayUserDetails
              session={session}
              initialDreams={dreams}
              initialError={error}
              userSettings={userSettings}
              searchResults={searchResults.length > 0 ? searchResults : dreams}
              selectedTag={selectedTag}
              onTagSelect={handleTagSelect}
            />
          </div>
        </>
      )}
    </div>
  );
}