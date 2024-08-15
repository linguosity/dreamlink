// src/types/dreamAnalysis.ts

export interface Verse {
    reference: string;
    text: string;
  }
  
  export interface DreamAnalysis {
    id: string;  // Add this line
    title: string;
    interpretation: string;
    tags: string[];
    verses: Verse[];
    originalDream: string;
    gematriaInterpretation?: string;
    colorSymbolism?: string;
  }
  
  export type InterpretationElement = string | PopoverContent;
  
  interface PopoverContent {
    type: 'Popover';
    props: {
      trigger: 'hover';
      content: string;
      children: string[];
    };
  }
  
  export interface UserProfile {
    id: string;
    username?: string;
    full_name?: string;
    avatar_url?: string;
    website?: string;
  }
  
  export interface DreamAnalysisEntry {
    id: number;
    user_id: string;
    title: string;
    original_dream: string;
    gematria_interpretation: string | null;
    color_symbolism: string | null;
    created_at: string;
    verses: Verse[];
    dream_tags: Array<{ tags: { id: number; name: string } }>;
    dream_entries?: Array<{ analysis: string }>;
    interpretation_elements: Array<{
      id: number;
      content: string;
      is_popover: boolean;
      popover_content: string | null;
      order_index: number;
    }>;
  }
  
  export interface DreamItem {
    id: string;
    status: 'loading' | 'complete';
    data?: DreamAnalysis;
  }