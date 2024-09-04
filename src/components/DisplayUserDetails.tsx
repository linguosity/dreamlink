'use client';

import React, { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import OpenAIAnalysisCard from './OpenAIAnalysisCard';
import DreamInputWrapper from "./DreamInputWrapper";
import { DreamItem } from '@/types/dreamAnalysis';
import { createSupabaseBrowserClient } from "../lib/utils/supabase/browser-client";
import CloudShape from "./CloudShape";
import useIsMobile from "@/app/hooks/useIsMobile";
import SwipeCards from './SwipeCards';
import { motion, AnimatePresence } from 'framer-motion';

interface DisplayUserDetailsProps {
  session: Session | null;
  initialDreams: DreamItem[] | null;
  initialError: any | null;
}

export default function DisplayUserDetails({
  session,
  initialDreams,
  initialError
}: DisplayUserDetailsProps) {
  const user = session?.user;
  const [dreams, setDreams] = useState<DreamItem[]>(initialDreams || []);
  const [error, setError] = useState(initialError);
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

      if (deleteError) throw deleteError;

      setDreams(prevDreams => prevDreams.filter(dream => dream.id !== dreamId));
    } catch (err) {
      console.error('Error deleting dream:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    }
  };

  const handleUpdate = async (updatedDream: DreamItem) => {
    try {
      const { error: updateError } = await supabase
        .from('dream_analyses')
        .update(updatedDream)
        .eq('id', updatedDream.id);

      if (updateError) throw updateError;

      setDreams(prevDreams => prevDreams.map(dream =>
        dream.id === updatedDream.id ? updatedDream : dream
      ));
    } catch (err) {
      console.error('Error updating dream:', err);
      setError(err as Error);
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

  if (!user) {
    return <p>Please log in to view your details.</p>;
  }

  return (
    <div className="space-y-6 m-8">
      <div className="relative flex items-center justify-center">
        <div className="relative animate-fade-left animate-once animate-duration-[800ms] animate-ease-out">
          <CloudShape />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
          <DreamInputWrapper userId={user.id} onAddDream={handleAddDream} />
        </div>
      </div>

      {error && <p className="text-red-500">Error: {error.message}</p>}

      {dreams && dreams.length > 0 ? (
        isMobile ? (
          <SwipeCards
            dreams={dreams}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
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
            <AnimatePresence>
              {dreams.map((dream, index) => (
                <motion.div
                  key={dream.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.5
                  }}
                  className="w-full min-w-[350px]"
                  style={getGridPosition(index)}
                >
                  <OpenAIAnalysisCard
                    index={index}
                    dream={dream}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                </motion.div>
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