
import { Database } from '@/types/supabase'; // Make sure this path is correct

export type DreamAnalysis = Database['public']['Tables']['dream_analyses']['Row'];

export interface Explanation {
  sentence: string;
  citation: {
    verse: string;
    text: string;
    book: string;
  };
}

export interface Verse {
  id: string;
  dream_analysis_id: string | null;
  reference: string;
  text: string;
  book: string;
  explanation: string;
}

export interface DreamTag {
  tags: {
    name: string;
  };
}

export interface InterpretationElement {
  content: string;
  is_popover: boolean;
  popover_content?: string | null;
  order_index: number;
}

export interface DreamEntry {
  analysis: string;
  created_at: string;
  id: number;
  user_id: string;
}

export interface DreamItem extends DreamAnalysis {
  status?: 'loading' | 'complete';
  topic_sentence: string | null; // Ensure compatibility with dream_analyses.topic_sentence
  explanations?: Explanation[]; // Added custom explanation type
  tags?: string[]; // Optional, since this isn't directly in the database schema
  dream_tags?: Array<{ tags: Database['public']['Tables']['tags']['Row'] }>; // Optional, as it’s an additional reference
  dream_entries?: Array<{ analysis: Json }>; // Optional to prevent mismatch
  verses?: Verse[]; // Optional or remove if not directly used
  interpretation_elements?: Database['public']['Tables']['interpretation_elements']['Row'][]; // Optional for compatibility
  user?: {
    full_name: string | null;
    avatar_url: string | null;
  }; // Optional to avoid mismatch if user isn't linked directly
  gematria_interpretation: string | null; // Nullable
  color_symbolism: string | null; // Nullable
  created_at: string | null; // Nullable
  updated_at: string | null; // Nullable
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
