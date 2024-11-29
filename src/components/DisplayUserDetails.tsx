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
import { HTMLMotionProps } from 'framer-motion';
import { MotionDiv } from '@/lib/motion';
import { UserSettingsRow } from "@/types/userSettings";
import { Badge } from 'flowbite-react';

// First, define the UserSettings type
export interface UserSettings {
  user_id: string;
  language: string;
  bible_version: string;
  created_at: string;
  updated_at: string;
}

// Then use it in the props interface
export interface DisplayUserDetailsProps {
  session: Session;
  initialDreams: DreamItem[];
  initialError: null | string;
  userSettings: UserSettingsRow | null;
}

export default function DisplayUserDetails({
  session,
  initialDreams,
  initialError,
  userSettings
}: DisplayUserDetailsProps) {
  const user = session?.user;
  const [dreams, setDreams] = useState<DreamItem[]>(initialDreams || []);
  const [error, setError] = useState<string | null>(initialError);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const gridRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const updateColumns = () => {
      if (gridRef.current) {
        const gridWidth = gridRef.current.offsetWidth;
        const cardWidth = 350; // minimum width of a card
        const gap = 16; // gap size in pixels
        const newColumns = Math.floor((gridWidth + gap) / (cardWidth + gap));
        setColumns(Math.max(1, newColumns));
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  const handleAddDream = (newDream: DreamItem) => {
    setDreams(prevDreams => [newDream, ...prevDreams]);
  };

  const handleDelete = async (dreamId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('dream_analyses')
        .delete()
        .eq('id', dreamId);

      if (deleteError) {
        setError(deleteError.message); // Now properly converts to string
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
        setError(updateError.message); // Convert to string
        return;
      }

      setDreams(prevDreams => prevDreams.map(dream =>
        dream.id === updatedDream.id ? updatedDream : dream
      ));
    } catch (err) {
      // Convert Error to string before setting
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const getGridPosition = (index: number) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      gridColumn: `${column + 1}`,
      gridRow: `${row + 1}`,
    };
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const filteredDreams = selectedTag
    ? dreams.filter(dream => 
        (dream.tags || [])
          .concat(dream.dream_tags?.map(dt => dt.tags.name) || [])
          .includes(selectedTag)
      )
    : dreams;

  if (!user) {
    return <p>Please log in to view your details.</p>;
  }

  return (
    <div className="space-y-6 m-8">
      <div className="flex flex-col items-center mb-8">
        <DreamInputWrapper userId={user.id} onAddDream={handleAddDream} />
        
        {selectedTag && (
          <div className="self-start mt-2 px-16">
            <Badge 
              color="indigo" 
              className="cursor-pointer" 
              onClick={() => setSelectedTag(null)}
            >
              #{selectedTag} ×
            </Badge>
          </div>
        )}
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}

      {dreams && dreams.length > 0 ? (
        isMobile ? (
          <SwipeCards
            dreams={filteredDreams}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onTagClick={handleTagClick}
          />
        ) : (
          <div 
            ref={gridRef}
            className="grid gap-4 p-4 dream-grid"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(350px, 1fr))`,
              gap: '1rem'
            }}
          >
            <AnimatePresence mode="wait">
              {filteredDreams.map((dream, index) => (
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
      ) : (
        <p>No dreams found. Start by adding a new dream!</p>
      )}
    </div>
  );
}
