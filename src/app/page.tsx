"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Dropdown, Avatar, Button } from "flowbite-react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { useChat } from 'ai/react';
import { AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';
import DreamInput from "./components/DreamInput";
import { SideNavbar } from "./components/Sidebar";
import LoadingDreamCard from "./components/LoadingDreamCard";
import OpenAIAnalysisCard from "./components/OpenAIAnalysisCard";
import { DreamAnalysis, DreamAnalysisEntry, DreamItem, UserProfile, InterpretationElement, Verse } from './types/dreamAnalysis';

function ErrorFallback({ error }: FallbackProps) {
  console.error("Error caught by boundary:", error);
  return (
    <div role="alert" className="p-4">
      <p>Something went wrong:</p>
      <pre className="mt-2 p-2 bg-red-100 rounded">{error.message}</pre>
    </div>
  );
}

export default function Home() {
  console.log("Home component function called");
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dreamItems, setDreamItems] = useState<DreamItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchUserProfile = useCallback(async (userId: string) => {
    console.log("Fetching user profile for userId:", userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
  
      if (error) {
        console.error('Supabase error fetching user profile:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No user profile data returned');
        throw new Error('No user profile data returned');
      }
  
      console.log("User profile fetched successfully:", data);
      setUserProfile(data as UserProfile);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      throw error;
    }
  }, [supabase]);
  
  const fetchDreams = useCallback(async (userId: string) => {
    console.log("Fetching dreams for userId:", userId);
    try {
      const { data, error } = await supabase
        .from('dream_analyses')
        .select(`
          *,
          verses (*),
          dream_tags (
            tags (*)
          ),
          interpretation_elements (*),
          dream_entries (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
  
      if (error) throw error;
  
      if (!data || !Array.isArray(data)) {
        throw new Error('No dream data returned or data is not an array');
      }
  
      console.log("Dreams fetched successfully:", data);
  
      const fetchedDreams: DreamItem[] = data.map((entry: DreamAnalysisEntry) => ({
        id: entry.id,
        status: 'complete',
        data: {
          title: entry.title,
          interpretation: entry.dream_entries && entry.dream_entries.length > 0
            ? entry.dream_entries[0].analysis
            : '',
          tags: entry.dream_tags?.map(dt => dt.tags.name) || [],
          verses: entry.verses || [],
          originalDream: entry.original_dream,
          gematriaInterpretation: entry.gematria_interpretation || undefined,
          colorSymbolism: entry.color_symbolism || undefined
        }
      }));
  
      setDreamItems(fetchedDreams);
    } catch (error) {
      console.error('Error in fetchDreams:', error);
      throw error;
    }
  }, [supabase]);
  
      

  useEffect(() => {
    console.log("Initial useEffect triggered");
    let isMounted = true;

    const fetchSessionAndData = async () => {
      try {
        setIsLoading(true);
        console.log("Set isLoading(true) called");

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error fetching session:', sessionError);
          throw sessionError;
        }

        console.log("Session fetch result:", session ? "Session found" : "No session");
        if (isMounted) setSession(session);

        if (session) {
          console.log("Fetching user profile and dreams");
          try {
            await fetchUserProfile(session.user.id);
            await fetchDreams(session.user.id);
            console.log("User profile and dreams fetched successfully");
          } catch (error) {
            console.error("Error fetching user data:", error);
            if (isMounted) setError('Failed to fetch user data. Please try again.');
          }
        } else {
          console.log("No session, redirecting to login");
          router.push("/login");
        }
      } catch (error) {
          console.error('Error in fetchSessionAndData:', error);
          if (isMounted) setError('Failed to set up session. Please try again.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log("Set isLoading(false) called in finally block");
        }
      }
    };

    fetchSessionAndData();

    return () => {
      console.log("Home component unmounting");
      isMounted = false;
    };
  }, [supabase.auth, router, fetchUserProfile, fetchDreams]);

  useEffect(() => {
    console.log('Current session state:', session ? 'Session exists' : 'No session');
    console.log('Current loading state:', isLoading);
    console.log('Current error state:', error);
    console.log('Current user profile:', userProfile);
    console.log('Current dream items:', dreamItems);
  }, [session, isLoading, error, userProfile, dreamItems]);

  const saveDreamToSupabase = useCallback(async (dreamData: DreamAnalysis) => {
    if (session) {
        try {
            const userId = session.user.id;
            console.log("Authenticated user's ID:", userId);

            // 1. Insert into dream_analyses table
            const { data: dreamAnalysis, error: analysisError } = await supabase
                .from('dream_analyses')
                .insert({
                    user_id: userId,
                    title: dreamData.title,
                    original_dream: dreamData.originalDream,
                    gematria_interpretation: dreamData.gematriaInterpretation,
                    color_symbolism: dreamData.colorSymbolism
                })
                .select()
                .single();

            if (analysisError || !dreamAnalysis) {
                throw new Error(`Failed to save dream analysis: ${analysisError?.message}`);
            }

            const dreamAnalysisId = dreamAnalysis.id;

            // 2. Insert verses
            if (dreamData.verses && dreamData.verses.length > 0) {
                const { error: versesError } = await supabase
                    .from('verses')
                    .insert(dreamData.verses.map((verse: Verse) => ({
                        dream_analysis_id: dreamAnalysisId,
                        reference: verse.reference,
                        text: verse.text
                    })));

                if (versesError) throw versesError;
            }

            // 3. Insert tags
            if (dreamData.tags && dreamData.tags.length > 0) {
                const { data: existingTags, error: tagsError } = await supabase
                    .from('tags')
                    .upsert(dreamData.tags.map(tag => ({ name: tag })), { onConflict: 'name' })
                    .select();

                if (tagsError || !existingTags) throw tagsError;

                const { error: dreamTagsError } = await supabase
                    .from('dream_tags')
                    .insert(existingTags.map(tag => ({
                        dream_analysis_id: dreamAnalysisId,
                        tag_id: tag.id
                    })));

                if (dreamTagsError) throw dreamTagsError;
            }

            // 4. Insert interpretation into dream_entries table
            if (dreamData.interpretation) {
                const { error: entriesError } = await supabase
                    .from('dream_entries')
                    .insert({
                        user_id: userId,
                        dream_analysis_id: dreamAnalysisId,
                        analysis: dreamData.interpretation  // <-- Save only the interpretation text here
                    });

                if (entriesError) throw entriesError;
            }

            console.log("Dream analysis saved successfully");
            return dreamAnalysis;
        } catch (error) {
            console.error("Error saving dream to Supabase:", error);
            throw error;
        }
    }
}, [session, supabase]);


const { input, handleInputChange, handleSubmit: originalHandleSubmit, isLoading: isChatLoading, setMessages } = useChat({
  api: '/api/chat',
  body: { user_id: session?.user?.id },
  onResponse: async (response: Response) => {
    console.log('API Response received:', response);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get reader from response body');
    }

    try {
      let responseText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        responseText += new TextDecoder().decode(value);
      }

      console.log('Raw response text:', responseText);

      const responseData: DreamAnalysis = JSON.parse(responseText);
      console.log('Parsed API response:', responseData);
      
      if (!Array.isArray(responseData.verses)) {
        responseData.verses = [];
      }

      const originalDream = localStorage.getItem('lastDreamInput') || '';
      responseData.originalDream = originalDream;

      // Save the dream to Supabase
      if (session) {
        await saveDreamToSupabase(responseData);
      } else {
        console.error('No active session. Unable to save dream.');
        setError('No active session. Unable to save dream.');
      }

      setDreamItems(prevItems => prevItems.map(item => 
        item.status === 'loading' ? { ...item, status: 'complete', data: responseData } : item
      ));
      setError(null);

      // Update the messages state
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: JSON.stringify(responseData)
        }
      ]);
    } catch (err) {
      console.error('Error processing response:', err);
      setError('Failed to process the dream analysis. Please try again.');
      setDreamItems(prevItems => prevItems.filter(item => item.status !== 'loading'));
    } finally {
      reader.releaseLock();
    }
  },
  onError: (error) => {
    console.error('Chat error:', error);
    setError(`An error occurred: ${error.message}`);
    setDreamItems(prevItems => prevItems.filter(item => item.status !== 'loading'));
  },
});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting new dream");
    localStorage.setItem('lastDreamInput', input);
    const newDreamItem: DreamItem = { id: Date.now(), status: 'loading' };
    setDreamItems(prevItems => [newDreamItem, ...prevItems]);
    
    try {
      console.log("Current session:", session);
      console.log("Current user ID:", session?.user?.id);
      await originalHandleSubmit(e);
    } catch (error) {
      console.error('Error submitting dream:', error);
      setError('Failed to submit dream. Please try again.');
      setDreamItems(prevItems => prevItems.filter(item => item.id !== newDreamItem.id));
    }
  };

  const handleDeleteDream = async (id: number) => {
    console.log("Deleting dream with id:", id);
    try {
      const { error } = await supabase
        .from('dream_analyses')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setDreamItems(prevItems => prevItems.filter((item) => item.id !== id));
      console.log("Dream deleted successfully");
    } catch (error) {
      console.error('Error deleting dream:', error);
      setError('Failed to delete dream. Please try again.');
    }
  };

  const handleUpdateDream = async (id: number, updatedDream: DreamAnalysis) => {
    console.log("Updating dream with id:", id);
    try {
      const { error } = await supabase
        .from('dream_analyses')
        .update({
          title: updatedDream.title,
          original_dream: updatedDream.originalDream,
          gematria_interpretation: updatedDream.gematriaInterpretation,
          color_symbolism: updatedDream.colorSymbolism
        })
        .eq('id', id);
      if (error) throw error;
      setDreamItems(prevItems => prevItems.map(item => 
        item.id === id ? { ...item, data: updatedDream } : item
      ));
      console.log("Dream updated successfully");
    } catch (error) {
      console.error('Error updating dream:', error);
      setError('Failed to update dream. Please try again.');
    }
  };

  const handleSignOut = async () => {
    console.log("Signing out");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    } else {
      console.log("Sign out successful, redirecting to login");
      router.push('/login');
    }
  };

  if (isLoading) {
    console.log("Rendering loading state");
    return <div>Loading... Please wait while we set up your session.</div>;
  }

  if (error) {
    console.log("Rendering error state:", error);
    return <div>Error: {error}</div>;
  }

  if (!session) {
    console.log("No active session, rendering redirect message");
    return <div>No active session. Redirecting to login...</div>;
  }

  console.log("Rendering main component");
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex flex-col h-screen">
        <header className="z-10">
          <Navbar fluid rounded>
            <Navbar.Brand href="/">
              <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Dreamlink</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
              {session ? (
                <Dropdown
                  arrowIcon={false}
                  inline
                  label={
                    <Avatar alt="User settings" img={userProfile?.avatar_url || session.user.user_metadata?.avatar_url} rounded />
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-sm">{userProfile?.full_name || session.user.user_metadata?.full_name}</span>
                    <span className="block truncate text-sm font-medium">{session.user.email}</span>
                  </Dropdown.Header>
                  <Dropdown.Item>Dashboard</Dropdown.Item>
                  <Dropdown.Item>Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
                </Dropdown>
              ) : (
                <Button onClick={() => router.push('/login')}>Sign in</Button>
              )}
              <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
              <Navbar.Link href="#" active>Home</Navbar.Link>
              <Navbar.Link href="#">About</Navbar.Link>
              <Navbar.Link href="#">Services</Navbar.Link>
              <Navbar.Link href="#">Pricing</Navbar.Link>
              <Navbar.Link href="#">Contact</Navbar.Link>
            </Navbar.Collapse>
          </Navbar>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <SideNavbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <DreamInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isLoading={isChatLoading}
              />
              <hr className="my-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                <AnimatePresence>
                  {dreamItems.map((item) => (
                    <div key={item.id} className="w-full max-w-sm mx-auto">
                      {item.status === 'loading' ? (
                        <LoadingDreamCard />
                      ) : item.data ? (
                        <OpenAIAnalysisCard 
                          dream={item.data} 
                          onDelete={() => handleDeleteDream(item.id)}
                          onUpdate={(updatedDream) => handleUpdateDream(item.id, updatedDream)}
                        />
                      ) : null}
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
