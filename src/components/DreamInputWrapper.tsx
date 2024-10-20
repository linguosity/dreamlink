// src/components/DreamInputWrapper.tsx

'use client'; // Indicates that this is a client-side component in Next.js

import React from 'react';
import DreamInputForm from './DreamInputForm'; // Import the DreamInputForm component
import { DreamItem } from '@/types/dreamAnalysis'; // Import from dreamAnalysis.ts
import { submitDream } from '../app/actions'; // Import the function to submit dreams
import { useUserSettings } from '@/context/UserSettingsContext'; // Import the hook to access user settings


interface DreamInputWrapperProps {
  userId: string; // The ID of the current user
  onAddDream: (dream: DreamItem) => void; // Function to call when a new dream is added
}

// This component wraps the dream input form and handles the logic for submitting dreams
export default function DreamInputWrapper({ userId, onAddDream }: DreamInputWrapperProps) {
  // Access the user's settings (language and Bible version)
  const { settings } = useUserSettings();

  // Function to handle the submission of the dream
  const handleSubmit = async (dreamText: string): Promise<boolean> => {
    // Check if user settings are available
    if (!settings) {
      console.error('User settings not available');
      return false; // Return false to indicate failure
    }

    console.log('Current user settings:', settings);

    try {
      // Call the submitDream function with the dream text and user settings
      const interpretation = await submitDream(
        dreamText,
        settings?.language || 'en', // Use user's preferred language or default to 'en'
        settings?.bible_version || 'Tree of Life' // Use user's preferred Bible version or default
      );

      console.log('Submitting dream with language:', settings?.language);

      if (interpretation) {
        // Create a new DreamItem object from the interpretation
        const dreamItem: DreamItem = {
          id: '', // The ID will be assigned by Supabase upon saving
          user_id: userId,
          original_dream: dreamText,
          title: interpretation.title,
          topic_sentence: interpretation.topic_sentence,
          explanations: interpretation.explanations,
          tags: interpretation.tags,
          color_symbolism: null,
          gematria_interpretation: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'complete',
          // Add these two properties
          bible_version: settings.bible_version || 'Tree of Life',
          language: settings.language || 'en',
          dream_tags: interpretation.tags.map(tag => ({ tags: { id: '', name: tag } })),
          dream_entries: [{ 
            analysis: interpretation as unknown as Json
          }],
          verses: interpretation.explanations.map(explanation => ({
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
            content: interpretation.topic_sentence,
            is_popover: false,
            order_index: 0,
            popover_content: null
          }],
          user: {
            full_name: 'User Name', // Replace with actual user's name if available
            avatar_url: null,
          },
        };

        // Add this console log
        console.log('Created dream item:', dreamItem);

        // Add the new dream to the list
        onAddDream(dreamItem);

        // Indicate that the submission was successful
        return true;
      }
    } catch (error) {
      console.error('Error submitting dream:', error);
    }

    // Indicate that the submission failed
    return false;
  };

  // Render the DreamInputForm component and pass necessary props
  return (
    <DreamInputForm
      userId={userId}
      userFullName="User Name" // Replace with actual user's name if available
      onAddDream={onAddDream}
      onSubmit={handleSubmit} // Pass the handleSubmit function to the form
    />
  );
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
