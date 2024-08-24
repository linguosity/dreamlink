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

export interface DreamItem extends DreamAnalysis {
  status: 'loading' | 'complete';
  topic_sentence: string;
  explanations: Explanation[];
  tags: string[];
  dream_tags: Array<{ tags: Database['public']['Tables']['tags']['Row'] }>;
  dream_entries: Array<{ analysis: Database['public']['Tables']['dream_entries']['Row']['analysis'] }>;
  verses: Database['public']['Tables']['verses']['Row'][];
  interpretation_elements: Database['public']['Tables']['interpretation_elements']['Row'][];
  user: {
    full_name: string | null;
    avatar_url: string | null;
  };
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