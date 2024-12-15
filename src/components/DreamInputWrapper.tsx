'use client';

import React from 'react';
import DreamInputForm from './DreamInputForm';
import { DreamItem } from '@/types/dreamAnalysis';
import { submitDream } from '../app/actions';
import { useUserSettings } from '@/context/UserSettingsContext';

interface DreamInputWrapperProps {
  userId: string;
  onAddDream: (dream: DreamItem) => void;
}

export default function DreamInputWrapper({ userId, onAddDream }: DreamInputWrapperProps) {
  const { settings } = useUserSettings();

  const handleSubmit = async (dreamText: string): Promise<boolean> => {
    if (!settings) {
      console.error('User settings not available');
      return false;
    }

    console.log('Current user settings:', settings);

    try {
      const interpretation = await submitDream(
        dreamText,
        settings?.language || 'en',
        settings?.bible_version || 'Tree of Life'
      );

      console.log('Submitting dream with language:', settings?.language);

      if (interpretation) {
        const dreamItem: DreamItem = {
          id: '',
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
            full_name: 'User Name',
            avatar_url: null,
          },
        };

        console.log('Created dream item:', dreamItem);

        onAddDream(dreamItem);
        return true;
      }
    } catch (error) {
      console.error('Error submitting dream:', error);
    }

    return false;
  };

  return (
    <DreamInputForm
      userId={userId}
      userFullName="User Name"
      onAddDream={onAddDream}
      onSubmit={handleSubmit}
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