'use client';

import React, { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import OpenAIAnalysisCard from './OpenAIAnalysisCard';
import DreamInputWrapper from "./DreamInputWrapper";
import { DreamItem } from '@/types/dreamAnalysis';
import { createSupabaseBrowserClient } from "../lib/utils/supabase/browser-client";
import useIsMobile from "@/app/hooks/useIsMobile";
import SwipeCards from './SwipeCards';
import { motion, AnimatePresence } from 'framer-motion';
import { MotionDiv } from '@/lib/motion';
import { UserSettingsRow } from "@/types/userSettings";
import { Badge } from 'flowbite-react';
import { v4 as uuidv4 } from 'uuid';

export interface UserSettings {
  user_id: string;
  language: string;
  bible_version: string;
  created_at: string;
  updated_at: string;
}

export interface DisplayUserDetailsProps {
  session: Session | null | undefined;
  initialDreams: DreamItem[];
  initialError: null | string;
  userSettings: UserSettingsRow | null;
  searchResults: DreamItem[];
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

export default function DisplayUserDetails({
  session,
  initialDreams,
  initialError,
  userSettings,
  searchResults,
  selectedTag,
  onTagSelect
}: DisplayUserDetailsProps) {
  const user = session?.user;
  const [dreams, setDreams] = useState<DreamItem[]>(initialDreams || []);
  const [error, setError] = useState<string | null>(initialError);
  const isMobile = useIsMobile();
  const gridRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (dreams.length > 0) {
      setIsLoading(false);
    }
  }, [dreams]);

  // Ensure each dream has a unique non-empty ID
  // This function is called when a new dream is created via DreamInputWrapper.
  const handleAddDream = (newDream: DreamItem) => {
    const uniqueDream = {
      ...newDream,
      // If the dream's id is empty or missing, generate a UUID
      id: newDream.id && newDream.id.trim() !== '' ? newDream.id : uuidv4(),
    };
    setDreams(prevDreams => [uniqueDream, ...prevDreams]);
  };

  const handleDelete = async (dreamId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('dream_analyses')
        .delete()
        .eq('id', dreamId);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setDreams(prevDreams => prevDreams.filter(dream => dream.id !== dreamId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleUpdate = async (updatedDream: DreamItem) => {
    try {
      const { error: updateError } = await supabase
        .from('dream_analyses')
        .update(updatedDream)
        .eq('id', updatedDream.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setDreams(prevDreams => prevDreams.map(dream =>
        dream.id === updatedDream.id ? updatedDream : dream
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const handleTagClick = (tag: string) => {
    console.log('[DisplayUserDetails] Tag clicked:', tag);
    onTagSelect(tag === selectedTag ? 'All Tags' : tag);
  };

  const displayedDreams = searchResults.length > 0 ? searchResults : dreams;

  // Also ensure that displayedDreams have unique IDs before rendering
  const sanitizedDreams = displayedDreams.map(dream => ({
    ...dream,
    id: dream.id && dream.id.trim() !== '' ? dream.id : uuidv4(),
  }));

  if (!user) {
    return <p>Please log in to view your details.</p>;
  }

  return (
    <div>
      <div className="flex flex-col items-center">
        {/* <DreamInputWrapper userId={user.id} onAddDream={handleAddDream} /> */}

        {selectedTag !== 'All Tags' && (
          <div className="self-start mt-2 px-16">
            <Badge
              color="indigo"
              className="cursor-pointer"
              onClick={() => onTagSelect('All Tags')}
            >
              #{selectedTag} ×
            </Badge>
          </div>
        )}
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}

      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}

      {!isLoading && sanitizedDreams.length === 0 && (
        <p>No dreams found. Start by adding a new dream!</p>
      )}

      {!isLoading && sanitizedDreams.length > 0 && (
        isMobile ? (
          <SwipeCards
            dreams={sanitizedDreams}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onTagClick={handleTagClick}
          />
        ) : (
          <div
            ref={gridRef}
            className="grid p-4 dream-grid"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1rem'
            }}
          >
            <AnimatePresence>
              {sanitizedDreams.map((dream, index) => (
                <MotionDiv
                  key={dream.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.6
                  }}
                  className="w-full relative"
                >
                  <OpenAIAnalysisCard
                    index={index}
                    dream={dream}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    onTagClick={handleTagClick}
                  />
                </MotionDiv>
              ))}
            </AnimatePresence>
          </div>
        )
      )}
    </div>
  );
}