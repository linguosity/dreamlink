'use client';

import React from 'react';
import { useDreams } from './ClientDreamsWrapper';
import OpenAIAnalysisCard from './OpenAIAnalysisCard';
import { DreamItem } from '../types/dreamAnalysis';

export default function DreamList({ userId }: { userId: string }) {
  const { dreams, addDream } = useDreams();

  const handleDelete = async (dreamId: string) => {
    console.log('Delete dream with id:', dreamId);
    // Implement delete logic here
  };

  const handleUpdate = async (updatedDream: DreamItem) => {
    console.log('Update dream:', updatedDream);
    // Implement update logic here
  };

  if (dreams.length === 0) {
    return <p>No dreams found. Start by adding a new dream!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dreams.map((dream) => (
        <OpenAIAnalysisCard
          key={dream.id}
          dream={dream}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
}