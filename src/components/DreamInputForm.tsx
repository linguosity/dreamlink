"use client"

import React, { useState } from 'react';
import { TextInput, Button, Spinner } from 'flowbite-react';
import { DreamInterpretation, DreamItem, Json } from '../types/dreamAnalysis';
import { useRouter } from 'next/navigation';
import { useDreams } from './ClientDreamsWrapper';

interface DreamInputFormProps {
  onSubmit: (dreamText: string) => Promise<DreamInterpretation | null>;
  userFullName: string;
}

export default function DreamInputForm({ onSubmit, userFullName }: DreamInputFormProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addDream } = useDreams();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await onSubmit(input);
    setIsLoading(false);
    if (result) {
      setInput('');
      // Convert DreamInterpretation to DreamItem
      const dreamItem: DreamItem = {
        id: '', // This will be set by Supabase
        user_id: '', // This will be set by Supabase
        original_dream: input,
        title: result.title,
        color_symbolism: null, // Not provided by OpenAI
        gematria_interpretation: null, // Not provided by OpenAI
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'complete',
        dream_tags: result.tags.map(tag => ({ tags: { id: '', name: tag } })),
        dream_entries: [{ 
          analysis: result as unknown as Json
        }],
        verses: result.interpretation.map(verse => ({
          id: '',
          dream_analysis_id: '',
          reference: verse.verse,
          text: verse.text,
          explanation: verse.explanation,
          book: verse.book
        })),
        interpretation_elements: [{
          id: '',
          dream_analysis_id: '',
          content: result.summary,
          is_popover: false,
          order_index: 0,
          popover_content: null
        }],
        user: {
          full_name: userFullName,
          avatar_url: null,
        },
      };
      addDream(dreamItem);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <p className="mb-2">Adding dream for: {userFullName}</p>
      <div className="flex items-center">
        <TextInput
          id="dream"
          type="text"
          placeholder="Enter your dream"
          required
          value={input}
          onChange={handleInputChange}
          className="flex-grow"
        />
        <Button type="submit" className="ml-2" color='blue' disabled={isLoading}>
          {isLoading ? <Spinner size="sm" /> : 'Add Dream'}
        </Button>
      </div>
    </form>
  );
}