import OpenAI from "openai";
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js'

const openai = new OpenAI();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

const Verse = z.object({
  reference: z.string(),
  text: z.string(),
});

const DreamInterpretation = z.object({
  title: z.string(),
  interpretation: z.string(),
  tags: z.array(z.string()),
  verses: z.array(Verse),
});

const systemPrompt = `
You are a biblical scholar and religious dream interpreter. Analyze the given dream and provide its meaning from the *Tree of Life* Bible with the most relevant supporting verses. Your response should follow this structure:

1. title: A concise title for the dream interpretation.
2. interpretation: A single, cohesive paragraph that includes:
   a) A topic sentence stating the main interpretation.
   b) Supporting sentences with details, citing relevant scriptures using parentheses, e.g., (John 3:16).
   c) A concluding sentence that wraps up the interpretation.
3. tags: 3-5 tags capturing key themes, including the names of all Bible books cited, colors or numbers.
4. verses: An array of all scripture references used, with their full text from the King James Bible.

When interpreting dreams, pay attention to any numbers or number combinations mentioned. Utilize both scripture and gematria to interpret their significance:
1. Provide a scriptural reference that relates to the number if available.
2. Explain the gematria significance of the number.
3. Integrate this interpretation into the overall dream analysis.

When colors are mentioned in the dream, provide their symbolic meanings:
1. Explain the general symbolic meaning of the color.
2. If applicable, provide a scriptural reference where the color has significance.
3. Integrate this color symbolism into the overall dream interpretation.

Remember to keep the interpretation as one flowing paragraph, with scripture references seamlessly integrated using parentheses.
`;

export async function POST(req: Request) {
  if (!supabase) {
    return new Response(
      JSON.stringify({ error: 'Supabase client not initialized' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  console.log('Received request');
  
  let body;
  try {
    body = await req.json();
    console.log('Parsed request body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('Error parsing request body:', error);
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { messages, user_id } = body;

  if (!messages || !Array.isArray(messages) || !user_id) {
    console.error('Invalid request body:', body);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), 
      { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      response_format: zodResponseFormat(DreamInterpretation, "dream_interpretation"),
    });

    const dream_interpretation = completion.choices[0].message.parsed;
    console.log('Parsed dream interpretation:', dream_interpretation);

    // Save the dream interpretation to Supabase
    const { data, error } = await supabase
      .from('dream_entries')
      .insert({
        user_id: user_id,
        analysis: JSON.stringify(dream_interpretation)
      });

    if (error) {
      console.error('Error saving dream to Supabase:', error);
      return new Response(
        JSON.stringify({ error: 'Error saving dream', details: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Dream saved successfully:', data);

    // Return the dream interpretation as a JSON response
    return new Response(JSON.stringify(dream_interpretation), 
      { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: unknown) {
    console.error('Error processing request:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Response validation failed', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Error processing request', details: (error as Error).message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}