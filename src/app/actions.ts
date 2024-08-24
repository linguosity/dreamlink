'use server';

import { createSupabaseServerClient } from '@/lib/utils/supabase/server-client';
import OpenAI from "openai";

const openai = new OpenAI();

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

export async function submitDream(dreamText: string): Promise<DreamInterpretation | null>  {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  try {
    // OpenAI request
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: `You are a biblical scholar and religious dream interpreter. Analyze a given dream and provide its meaning from the King James Bible with the most relevant supporting verses. Your response should be a JSON object with the following structure: { "title": "A short title for the dream interpretation", "summary": "A concise 1-2 line summary of the user's dream", "tags": ["tag1", "tag2", "tag3", ...], "interpretation": [ { "verse": "Book Chapter:Verse", "text": "Actual text of the verse from the Bible", "explanation": "Detailed explanation of how the verse relates to the dream", "book": "Name of the Bible book" }, ... ] } Provide 3-5 relevant verse interpretations for each dream.` },
        { role: "user", content: dreamText }
      ],
      response_format: { type: "json_object" },
    });

    const dreamInterpretation: DreamInterpretation = JSON.parse(completion.choices[0].message.content || '{}');
    console.log('Dream interpretation:', dreamInterpretation);

    // Save to Supabase
    const { data: dreamAnalysis, error: dreamError } = await supabase
      .from('dream_analyses')
      .insert({
        user_id: session.user.id,
        original_dream: dreamText,
        title: dreamInterpretation.title,
        color_symbolism: null, // You might want to extract this from the interpretation if needed
        gematria_interpretation: null, // You might want to extract this from the interpretation if needed
      })
      .select()
      .single();

    if (dreamError) throw dreamError;

    // Insert interpretation elements
    const { error: interpretationError } = await supabase
      .from('interpretation_elements')
      .insert({
        dream_analysis_id: dreamAnalysis.id,
        content: dreamInterpretation.summary,
        is_popover: false,
        order_index: 0
      });

    if (interpretationError) throw interpretationError;

    // Insert verses
    const { error: versesError } = await supabase
      .from('verses')
      .insert(dreamInterpretation.interpretation.map(verse => ({
        dream_analysis_id: dreamAnalysis.id,
        reference: verse.verse,
        text: verse.text,
        explanation: verse.explanation,
        book: verse.book
      })));

    if (versesError) throw versesError;

    // Insert tags
    for (const tag of dreamInterpretation.tags) {
      const { data: existingTag } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tag)
        .single();

      let tagId;
      if (existingTag) {
        tagId = existingTag.id;
      } else {
        const { data: newTag, error: newTagError } = await supabase
          .from('tags')
          .insert({ name: tag })
          .select('id')
          .single();

        if (newTagError) throw newTagError;
        tagId = newTag.id;
      }

      const { error: dreamTagError } = await supabase
        .from('dream_tags')
        .insert({
          dream_analysis_id: dreamAnalysis.id,
          tag_id: tagId
        });

      if (dreamTagError) throw dreamTagError;
    }

    return dreamInterpretation; // Correct

  } catch (error) {
    console.error('Error submitting dream:', error);
    return null; // Correct
  }
}