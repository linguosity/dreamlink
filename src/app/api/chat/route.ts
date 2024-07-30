import OpenAI from "openai";
import { StreamingTextResponse } from 'ai';

const openai = new OpenAI();

export const runtime = 'edge';

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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a dream interpreter. Analyze dreams and provide meanings from the King James Bible with supporting verses. Your response should be a JSON object structured exactly like this example:

\`\`\`
{
  "dream": "A brief summary of the dream in one sentence",
  "meaning": "A concise interpretation of the dream's meaning",
  "interpretation": [
    {
      "verse": "Book Chapter:Verse",
      "explanation": "How this verse relates to the dream interpretation"
    },
    {
      "verse": "Another Book Chapter:Verse",
      "explanation": "Explanation of how this verse relates to the dream"
    },
    {
      "verse": "Third Book Chapter:Verse",
      "explanation": "Another explanation linking the verse to the dream"
    }
  ]
}
\`\`\`

Always provide exactly three verses in the interpretation array. Ensure your response is a valid JSON object matching this structure.`
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
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return new Response('Error processing request', { status: 500 });
  }
}