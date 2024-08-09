export interface Verse {
    reference: string;
    text: string;
  }
  
  export interface DreamAnalysis {
    title: string;
    interpretation: string | InterpretationElement[];
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