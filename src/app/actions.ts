'use server';

import { createSupabaseServerClient } from '@/lib/utils/supabase/server-client';
import OpenAI from "openai";

const openai = new OpenAI();

export interface Explanation {
  sentence: string;
  citation: {
    verse: string;
    text: string;
    book: string;
  };
}

export interface DreamInterpretation {
  title: string;
  topic_sentence: string;
  explanations: Explanation[];
  tags: string[];
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
        { role: "system", content: `You are a biblical scholar and religious dream interpreter. Analyze a given dream and provide its meaning from the Tree of Life Bible with the most relevant supporting verses. Your response should be a JSON object with the following structure: { "title": "A short title for the dream interpretation", "topic_sentence": "A topic sentence describing what the symbols in the dream represent", "explanations": [ { "sentence": "A supporting sentence explaining the dream symbol with a reference to a specific Bible verse", "citation": { "verse": "Book Chapter:Verse", "text": "Actual text of the verse from the Bible", "book": "Name of the Bible book" } }, ... ], "tags": ["tag1", "tag2", "tag3", ...] } Provide 3-5 relevant verse explanations for each dream.` },
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
        content: dreamInterpretation.topic_sentence,
        is_popover: false,
        order_index: 0
      });

    if (interpretationError) throw interpretationError;

    // Insert verses
    const { error: versesError } = await supabase
      .from('verses')
      .insert(dreamInterpretation.explanations.map(explanation => ({
        dream_analysis_id: dreamAnalysis.id,
        reference: explanation.citation.verse,
        text: explanation.citation.text,
        explanation: explanation.sentence,
        book: explanation.citation.book
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

    return dreamInterpretation;

  } catch (error) {
    console.error('Error submitting dream:', error);
    return null;
  }
}