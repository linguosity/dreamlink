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
          content: `
            You are a biblical scholar and religious dream interpreter. Analyze a given dream and provide its meaning from the King James Bible with the most relevant supporting verses. Your response should be a JSON object with the following structure:

            {
              "title": "A short title for the dream interpretation",
              "summary": "A concise 1-2 line summary of the user's dream, citing relevant scriptures using popovers (e.g., 'The haunted house symbolizes the unknown or unresolved issues in your life, while the lost keys represent opportunities or solutions that feel just out of reach. ($Proverbs 3:5-6$)')",
              "tags": ["tag1", "tag2", "tag3", ...],
              "interpretation": [
                {
                  "verse": "Book Chapter:Verse",
                  "text": "Actual text of the verse from the Bible",
                  "explanation": "Detailed explanation of how the verse relates to the dream",
                  "book": "Name of the Bible book"
                },
                ...
              ]
            }
            
            
          
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