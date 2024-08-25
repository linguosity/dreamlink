'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createSupabaseBrowserClient } from '@/lib/utils/supabase/browser-client';
import { DreamItem } from '../types/dreamAnalysis';

interface ClientDreamsWrapperProps {
  children: ReactNode;
  initialDreams: DreamItem[];
}

const DreamsContext = createContext<{
  dreams: DreamItem[];
  addDream: (newDream: DreamItem) => void;
}>({
  dreams: [],
  addDream: () => {},
});

export const useDreams = () => useContext(DreamsContext);

export default function ClientDreamsWrapper({ children, initialDreams }: ClientDreamsWrapperProps) {
  const [dreams, setDreams] = useState<DreamItem[]>(initialDreams);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const channel = supabase
      .channel('dream_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'dream_analyses' }, 
        (payload: { new: DreamItem }) => {
          setDreams((prevDreams) => [payload.new, ...prevDreams]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const addDream = (newDream: DreamItem) => {
    setDreams((prevDreams) => [newDream, ...prevDreams]);
  };

  return (
    <DreamsContext.Provider value={{ dreams, addDream }}>
      {children}
    </DreamsContext.Provider>
  );
}