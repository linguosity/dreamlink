"use client";

import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { Card, Button } from 'flowbite-react';
import OpenAIAnalysisCard from './OpenAIAnalysisCard';
import DreamInputWrapper from "./DreamInputWrapper";
import { DreamItem } from '@/types/dreamAnalysis';

export default function DisplayUserDetails({
  session,
  rawDreams,
  error
}: {
  session: Session | null;
  rawDreams: DreamItem[] | null;
  error: any | null;
}) {
  const user = session?.user;
  const [isHidden, setIsHidden] = useState(true);

  const handleDelete = async (dreamId: string) => {
    console.log('Delete dream with id:', dreamId);
    // Implement delete logic here
  };

  const handleUpdate = async (updatedDream: DreamItem) => {
    console.log('Update dream:', updatedDream);
    // Implement update logic here
  };

  if (!user) {
    return <p>Please log in to view your details.</p>;
  }

  return (
    <div className="space-y-6">
      
      <Card>
        <DreamInputWrapper userId={user.id} />
        {error && <p className="text-red-500">Error fetching dreams: {error.message}</p>}
        {rawDreams && rawDreams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rawDreams.map((dream) => (
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
      </Card>
    </div>
  );
}