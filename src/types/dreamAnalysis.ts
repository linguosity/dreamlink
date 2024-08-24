// src/types/dreamAnalysis.ts

import { Database } from "../lib/utils/supabase/database.types";

export type DreamAnalysis = Database['public']['Tables']['dream_analyses']['Row'];

export interface DreamItem extends DreamAnalysis {
  status: 'loading' | 'complete';
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
  summary: string;
  tags: string[];
  interpretation: VerseInterpretation[];
}

// You might want to add this type if you're using it elsewhere
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// If you need to export the entire Database type, you can do so like this:
export type { Database };