// src/types/dreamAnalysis.ts

import { Database } from "../lib/utils/supabase/database.types";

export type DreamAnalysis = Database['public']['Tables']['dream_analyses']['Row'];

export interface Explanation {
  sentence: string;
  citation: {
    verse: string;
    text: string;
    book: string;
  };
}

// Update this interface to match your database structure
export interface Verse {
  id: string;
  dream_analysis_id: string | null;
  reference: string;
  text: string;
  book: string;
  explanation: string;
}

export interface DreamItem extends DreamAnalysis {
  status: 'loading' | 'complete';
  topic_sentence: string;
  explanations: Explanation[];
  tags: string[];
  dream_tags: Array<{ tags: Database['public']['Tables']['tags']['Row'] }>;
  dream_entries: Array<{ analysis: Database['public']['Tables']['dream_entries']['Row']['analysis'] }>;
  verses: Verse[];
  interpretation_elements: Database['public']['Tables']['interpretation_elements']['Row'][];
  user: {
    full_name: string | null;
    avatar_url: string | null;
  };
  gematria_interpretation: string | null;
  color_symbolism: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface VerseInterpretation {
  verse: string;
  text: string;
  explanation: string;
  book: string;
}

export interface DreamInterpretation {
  title: string;
  topic_sentence: string;
  explanations: Explanation[];
  tags: string[];
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type { Database };