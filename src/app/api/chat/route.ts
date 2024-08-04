import OpenAI from "openai";
import { StreamingTextResponse } from 'ai';

const openai = new OpenAI();

export const runtime = 'edge';

interface OpenAIError extends Error {
  status?: number;
  code?: string;
  param?: string;
  type?: string;
}

export async function POST(req: Request) {
  console.log('Received request');
  
  let body;
  try {
    body = await req.json();
    console.log('Parsed request body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('Error parsing request body:', error);
    return new Response('Invalid JSON', { status: 400 });
  }

  const { messages } = body;

  if (!messages || !Array.isArray(messages)) {
    console.error('Invalid messages array:', messages);
    return new Response('Invalid messages array', { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // Make sure this is the correct model name
      messages: [
        {
          role: "system",
          content: 
          `
            You are a biblical scholar and religious dream interpreter. Analyze a given dream and provide its meaning from the King James Bible with the most relevant supporting verses. Your response should be a JSON object with the following structure:

            {
              "title": "A concise title for the dream interpretation",
              "interpretation": "A structured paragraph that includes: 1) A topic sentence stating the main interpretation of the dream. 2) Supporting sentences with details and specific examples, citing at least three relevant scriptures using \`$...$\` tags (e.g., 'This is supported by \`$Proverbs 3:5-6$\`, which emphasizes...'). 3) Logical, coherent thoughts developed in order from one sentence to the next. 4) A concluding sentence that wraps up the interpretation. The paragraph should be concise yet informative, suitable for display in a compact card format.",
              "tags": ["tag1", "tag2", "tag3"],
              "verses": [
                {
                  "reference": "Book Chapter:Verse",
                  "text": "Full text of the referenced verse from the King James Bible"
                }
              ]
            }

            Important notes:
            1. The "interpretation" should be a single, well-structured paragraph following the format described above.
            2. Use \`$...$\` tags around scripture references in the interpretation text. Do not include the full verse text within the interpretation.
            3. Include 3-5 relevant tags that capture key themes or elements of the dream and its interpretation. Ensure that the names of all Bible books cited in the interpretation are included as tags.
            4. The "verses" array should contain all scripture references used in the interpretation, with their full text from the King James Bible. This will be used to populate the popup content in the user interface.
            5. Ensure that all scripture references are from the King James Version of the Bible.
      
          `
        },
        ...messages
      ],
      response_format: { type: "json_object" },
      stream: true,
    });

    console.log('OpenAI API call made successfully');

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let accumulatedResponse = '';

        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          accumulatedResponse += content;
          controller.enqueue(encoder.encode(content));
        }

        console.log('Full response:', accumulatedResponse);
        controller.close();
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error: unknown) {
    console.error('Error calling OpenAI API:', error);
    
    let errorMessage = 'An unknown error occurred';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check if it's an OpenAI error
      const openAIError = error as OpenAIError;
      if (openAIError.status) {
        statusCode = openAIError.status;
      }
    }

    return new Response(
      JSON.stringify({ error: 'Error processing request', details: errorMessage }),
      { status: statusCode, headers: { 'Content-Type': 'application/json' } }
    );
  }
}