// src/app/HomeClient.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Dropdown, Avatar, Button } from "flowbite-react";
import { ErrorBoundary } from "react-error-boundary";
import { AnimatePresence } from 'framer-motion';
import DreamInput from "./components/DreamInput";
import { SideNavbar } from "./components/Sidebar";
import LoadingDreamCard from "./components/LoadingDreamCard";
import OpenAIAnalysisCard from "./components/OpenAIAnalysisCard";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Session } from '@supabase/supabase-js';
import { DreamItem, UserProfile } from './types/dreamAnalysis';

interface HomeClientProps {
  session: Session | null;
  userProfile: UserProfile | null;
  initialDreamItems: DreamItem[];
  error: string | null;
}

export function HomeClient({
  session,
  userProfile,
  initialDreamItems,
  error: serverError,
}: HomeClientProps) {
  const [dreamItems, setDreamItems] = useState<DreamItem[]>(initialDreamItems);
  const [error, setError] = useState<string | null>(serverError);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError('Failed to sign out. Please try again.');
    } else {
      router.push('/login');
    }
  };

  const handleDeleteDream = async (id: string) => {
    try {
      setIsLoading(true);
      
      // 1. Delete associated verses
      const { error: versesError } = await supabase
        .from('verses')
        .delete()
        .eq('dream_analysis_id', id);
      if (versesError) throw versesError;

      // 2. Delete associated dream tags
      const { error: tagsError } = await supabase
        .from('dream_tags')
        .delete()
        .eq('dream_analysis_id', id);
      if (tagsError) throw tagsError;

      // 3. Delete associated dream entries
      const { error: entriesError } = await supabase
        .from('dream_entries')
        .delete()
        .eq('dream_analysis_id', id);
      if (entriesError) throw entriesError;

      // 4. Delete associated interpretation elements (if this table exists)
      const { error: interpretationError } = await supabase
        .from('interpretation_elements')
        .delete()
        .eq('dream_analysis_id', id);
      if (interpretationError && interpretationError.code !== 'PGRST116') throw interpretationError;

      // 5. Finally, delete the dream analysis itself
      const { error: dreamError } = await supabase
        .from('dream_analyses')
        .delete()
        .eq('id', id);
      if (dreamError) throw dreamError;

      // Update the UI
      setDreamItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      setError('Failed to delete dream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDream = async (id: string, updatedDream: DreamItem['data'] | undefined) => {
    if (!updatedDream) return;
    try {
      setIsLoading(true);
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

      setDreamItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, data: updatedDream } : item
        )
      );
    } catch (error) {
      setError('Failed to update dream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading... Please wait while we set up your session.</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!session) {
    return <div>No active session. Redirecting to login...</div>;
  }

  return (
    <ErrorBoundary FallbackComponent={({ error }) => (
      <div role="alert" className="p-4">
        <p>Something went wrong:</p>
        <pre className="mt-2 p-2 bg-red-100 rounded">{error.message}</pre>
      </div>
    )}>
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
                    <Avatar alt="User settings" img={userProfile?.avatar_url || session.user?.user_metadata?.avatar_url} rounded />
                  }
                >
                  <Dropdown.Header>
                    <span className="block text-sm">{userProfile?.full_name || session.user?.user_metadata?.full_name}</span>
                    <span className="block truncate text-sm font-medium">{session.user?.email}</span>
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
                input="" 
                handleInputChange={() => {}} 
                handleSubmit={() => {}} 
                isLoading={false} 
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