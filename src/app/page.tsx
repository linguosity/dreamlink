"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Dropdown, Avatar, Button } from "flowbite-react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { AnimatePresence } from 'framer-motion';
import DreamInput from "./components/DreamInput";
import { SideNavbar } from "./components/Sidebar";
import LoadingDreamCard from "./components/LoadingDreamCard";
import OpenAIAnalysisCard from "./components/OpenAIAnalysisCard";
import { createClient } from '@supabase/supabase-js';

import { Session } from '@supabase/supabase-js';
import { DreamItem, UserProfile } from './types/dreamAnalysis';

// Define a type for the props
interface HomeProps {
  session: Session | null;
  userProfile: UserProfile | null;
  initialDreamItems: DreamItem[];
  error: string | null;
}

// Error fallback component definition
function ErrorFallback({ error }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function Home({
  session,
  userProfile,
  initialDreamItems,
  error: serverError,
}: HomeProps) {
  console.log("Home component function called");
  const [dreamItems, setDreamItems] = useState<DreamItem[]>(initialDreamItems);
  const [error, setError] = useState<string | null>(serverError);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log('Current session state:', session ? 'Session exists' : 'No session');
    console.log('Current error state:', error);
    console.log('Current user profile:', userProfile);
    console.log('Current dream items:', dreamItems);
  }, [session, error, userProfile, dreamItems]);

  const handleSignOut = async () => {
    console.log("Signing out");
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    } else {
      console.log("Sign out successful, redirecting to login");
      router.push('/login');
    }
  };

  const handleDeleteDream = async (id: string) => {
    console.log("handleDeleteDream called with id:", id);
    try {
      const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

      // 1. Delete associated verses
      console.log("Attempting to delete associated verses");
      const { error: versesError } = await supabase
        .from('verses')
        .delete()
        .eq('dream_analysis_id', id);
      if (versesError) throw versesError;
      console.log("Associated verses deleted successfully");

      // 2. Delete associated dream tags
      console.log("Attempting to delete associated dream tags");
      const { error: tagsError } = await supabase
        .from('dream_tags')
        .delete()
        .eq('dream_analysis_id', id);
      if (tagsError) throw tagsError;
      console.log("Associated dream tags deleted successfully");

      // 3. Delete associated dream entries
      console.log("Attempting to delete associated dream entries");
      const { error: entriesError } = await supabase
        .from('dream_entries')
        .delete()
        .eq('dream_analysis_id', id);
      if (entriesError) throw entriesError;
      console.log("Associated dream entries deleted successfully");

      // 4. Delete associated interpretation elements (if this table exists)
      console.log("Attempting to delete associated interpretation elements");
      const { error: interpretationError } = await supabase
        .from('interpretation_elements')
        .delete()
        .eq('dream_analysis_id', id);
      if (interpretationError && interpretationError.code !== 'PGRST116') throw interpretationError;
      console.log("Associated interpretation elements deleted successfully");

      // 5. Finally, delete the dream analysis itself
      console.log("Attempting to delete dream analysis");
      const { error: dreamError } = await supabase
        .from('dream_analyses')
        .delete()
        .eq('id', id);
      if (dreamError) throw dreamError;
      console.log("Dream analysis deleted successfully");

      // Update the UI
      setDreamItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting dream:', error);
      setError('Failed to delete dream. Please try again.');
    }
  };

  const handleUpdateDream = async (id: string, updatedDream: DreamItem['data'] | undefined) => {
    if (!updatedDream) return;
    console.log("Updating dream with id:", id);
    try {
      const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

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
      console.log("Dream updated successfully");
    } catch (error) {
      console.error('Error updating dream:', error);
      setError('Failed to update dream. Please try again.');
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
                // Assuming you have the necessary props for DreamInput
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
