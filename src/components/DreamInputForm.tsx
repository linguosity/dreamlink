'use client';

import React, { useState } from 'react';
import { TextInput, Button, Spinner } from 'flowbite-react';
import { DreamInterpretation, DreamItem, Json } from '../types/dreamAnalysis';
import { useRouter } from 'next/navigation';
import { useDreams } from './ClientDreamsWrapper';
import { submitDream } from '../app/actions';
import CloudShape from './CloudShape';

interface DreamInputFormProps {
  userId: string;
  userFullName: string;
  onAddDream: (dream: DreamItem) => void;
}

export default function DreamInputForm({ userId, userFullName, onAddDream }: DreamInputFormProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { addDream } = useDreams();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await submitDream(input);
    setIsLoading(false);
    if (result) {
      setInput('');
      // Convert DreamInterpretation to DreamItem
      const dreamItem: DreamItem = {
        id: '', // This will be set by Supabase
        user_id: userId,
        original_dream: input,
        title: result.title,
        topic_sentence: result.topic_sentence,
        explanations: result.explanations,
        tags: result.tags,
        color_symbolism: null,
        gematria_interpretation: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'complete',
        dream_tags: result.tags.map(tag => ({ tags: { id: '', name: tag } })),
        dream_entries: [{ 
          analysis: result as unknown as Json
        }],
        verses: result.explanations.map(explanation => ({
          id: '',
          dream_analysis_id: '',
          reference: explanation.citation.verse,
          text: explanation.citation.text,
          explanation: explanation.sentence,
          book: explanation.citation.book
        })),
        interpretation_elements: [{
          id: '',
          dream_analysis_id: '',
          content: result.topic_sentence,
          is_popover: false,
          order_index: 0,
          popover_content: null
        }],
        user: {
          full_name: userFullName,
          avatar_url: null,
        },
      };
      onAddDream(dreamItem);
      addDream(dreamItem);
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-center">
          <div className="center-box mr-4">
            
              <textarea
                  id="dream"
                  placeholder="Enter your dream"
                  required
                  value={input}
                  onChange={handleInputChange}
                  className="cloud-textarea focus:outline-none focus:ring-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-out"
              />
              
            
          </div>
          <Button 
                  type="submit" 
                  size="sm"
                  color='blue' 
                  disabled={isLoading}
                  className="cloud-button animate-fade-left animate-once animate-duration-[800ms] animate-ease-out"
              >
                {isLoading ? <Spinner size="sm" /> : 'Add Dream'}
              </Button>
        </div>

    </form>
  );
}