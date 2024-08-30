"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Card } from 'flowbite-react';
import OpenAIAnalysisCard from './OpenAIAnalysisCard';
import DreamInputWrapper from "./DreamInputWrapper";
import { DreamItem } from '@/types/dreamAnalysis';
import { createSupabaseBrowserClient } from "../lib/utils/supabase/browser-client";
import CloudShape from "./CloudShape";

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

  const supabase = createSupabaseBrowserClient();

  const handleAddDream = (newDream: DreamItem) => {
    setDreams(prevDreams => [newDream, ...prevDreams]);
  };

  const handleDelete = async (dreamId: string) => {
    console.log('Deleting dream with id:', dreamId);
    try {
      const { error: deleteError } = await supabase
        .from('dream_analyses')
        .delete()
        .eq('id', dreamId);

      if (deleteError) throw deleteError;

      // Update local state to remove the deleted dream
      setDreams(prevDreams => prevDreams.filter(dream => dream.id !== dreamId));
      console.log('Dream deleted successfully');
    } catch (err) {
      console.error('Error deleting dream:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    }
  };

  const handleUpdate = async (updatedDream: DreamItem) => {
    console.log('Update dream:', updatedDream);
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

  if (!user) {
    return <p>Please log in to view your details.</p>;
  }

  return (
    <div className="space-y-6 m-8">
       <div className="relative flex items-center justify-center">
        <div className="relative">
          {/* CloudShape positioned behind */}
          <CloudShape />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
          {/* DreamInputWrapper positioned at the bottom */}
          <DreamInputWrapper userId={user.id} onAddDream={handleAddDream} />
        </div>
      </div>


          
        
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {dreams && dreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {dreams.map((dream) => (
              <OpenAIAnalysisCard
                key={dream.id}
                dream={dream}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        ) : (
          <p>No dreams found. Start by adding a new dream!</p>
        )}
      
    </div>
  );
}