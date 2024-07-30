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
          content: `
          You are a biblical scholar and religious dream interpreter. Analyze a given dream and provide its meaning from the King James Bible with the most relevant supporting verses. Your response should be a JSON object with the following structure:

            {
              "summary": "A concise 1-2 line summary of the user's dream",
              "tags": ["tag1", "tag2", "tag3", ...],
              "interpretation": [
                {
                  "verse": "Book Chapter:Verse",
                  "explanation": "Detailed explanation of how the verse relates to the dream",
                  "book": "Name of the Bible book"
                },
                ...
              ]
            }

            Guidelines:
            1. The 'summary' should be a brief, 1-2 line description of the key elements of the user's dream.
            2. The 'tags' array should include keywords from the dream and the names of the Bible books referenced.
            3. Each item in the 'interpretation' array represents an Accordion panel.
            4. The 'verse' field will be used as the Accordion.Title.
            5. The 'explanation' field will be used as the Accordion.Content.
            6. Include the 'book' field to easily reference which book of the Bible the verse is from.
            7. Provide 3-5 relevant verse interpretations for each dream.

            Example response:

            {
              "summary": "Dreaming of building and caring for an ant farm",
              "tags": ["ants", "diligence", "teamwork", "perseverance", "Proverbs", "Ecclesiastes", "Corinthians", "Galatians", "Matthew"],
              "interpretation": [
                {
                  "verse": "Proverbs 6:6-8",
                  "explanation": "Go to the ant, thou sluggard; consider her ways, and be wise: Which having no guide, overseer, or ruler, Provideth her meat in the summer, and gathereth her food in the harvest. This verse highlights the wisdom and industrious nature of ants, symbolizing diligence, hard work, and preparation. Building an ant farm in your dream may represent your efforts to emulate these virtues in your own life, emphasizing the importance of being proactive and industrious.",
                  "book": "Proverbs"
                },
                {
                  "verse": "1 Corinthians 12:14-18",
                  "explanation": "For the body is not one member, but many. If the foot shall say, Because I am not the hand, I am not of the body; is it therefore not of the body? And if the ear shall say, Because I am not the eye, I am not of the body; is it therefore not of the body? If the whole body were an eye, where were the hearing? If the whole were hearing, where were the smelling? But now hath God set the members every one of them in the body, as it hath pleased him. This passage speaks to the importance of every individual's role within a community or organization. Caring for an ant farm in your dream might symbolize your understanding and appreciation of teamwork and the contributions of each member in a collective effort, mirroring the way each part of the body is vital to the whole.",
                  "book": "1 Corinthians"
                }
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
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return new Response('Error processing request', { status: 500 });
  }
}