'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Dropdown, Avatar, Button } from "flowbite-react";
import { ErrorBoundary } from "react-error-boundary";
import { AnimatePresence } from 'framer-motion';
import DreamInput from "./components/DreamInput";
import { SideNavbar } from "./components/Sidebar";
import LoadingDreamCard from "./components/LoadingDreamCard";
import OpenAIAnalysisCard from "./components/OpenAIAnalysisCard";
import { useSupabase } from '@/hooks/useSupabase';
import { DreamItem, UserProfile } from './types/dreamAnalysis';
import { AuthError } from '@supabase/supabase-js';

interface HomeClientProps {
  initialUserProfile: UserProfile | null;
  initialDreamItems: DreamItem[];
  initialError: string | null;
}

export function HomeClient({
  initialUserProfile,
  initialDreamItems,
  initialError,
}: HomeClientProps) {
  const [dreamItems, setDreamItems] = useState<DreamItem[]>(initialDreamItems);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(initialUserProfile);
  const [error, setError] = useState<string | null>(initialError);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { supabase, session } = useSupabase();

  useEffect(() => {
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/login');
    } catch (error) {
      if (error instanceof AuthError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
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
      {/* ... (keep the rest of your JSX) */}
    </ErrorBoundary>
  );
}
