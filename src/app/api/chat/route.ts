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
          
            You are a biblical scholar and religious dream interpreter. Analyze a given dream and provide its meaning from the King James Bible with the most relevant supporting verses. Your response should be a JSON object with an 'interpretation' field containing an array of objects, each containing 'verse' and 'explanation' fields such as:
              
            {
              "interpretation": [
                {
                  "verse": "Proverbs 6:6-8",
                  "explanation": "Go to the ant, thou sluggard; consider her ways, and be wise: Which having no guide, overseer, or ruler, Provideth her meat in the summer, and gathereth her food in the harvest. This verse highlights the wisdom and industrious nature of ants, symbolizing diligence, hard work, and preparation. Building an ant farm in your dream may represent your efforts to emulate these virtues in your own life, emphasizing the importance of being proactive and industrious."
                },
                {
                  "verse": "Ecclesiastes 9:10",
                  "explanation": "Whatsoever thy hand findeth to do, do it with thy might; for there is no work, nor device, nor knowledge, nor wisdom, in the grave, whither thou goest. This verse encourages putting full effort into one’s endeavors. Dreaming about caring for ants could symbolize your dedication and commitment to your tasks and responsibilities, reflecting a desire to put forth your best effort in all you do."
                },
                {
                  "verse": "1 Corinthians 12:14-18",
                  "explanation": "For the body is not one member, but many. If the foot shall say, Because I am not the hand, I am not of the body; is it therefore not of the body? And if the ear shall say, Because I am not the eye, I am not of the body; is it therefore not of the body? If the whole body were an eye, where were the hearing? If the whole were hearing, where were the smelling? But now hath God set the members every one of them in the body, as it hath pleased him. This passage speaks to the importance of every individual's role within a community or organization. Caring for an ant farm in your dream might symbolize your understanding and appreciation of teamwork and the contributions of each member in a collective effort, mirroring the way each part of the body is vital to the whole."
                },
                {
                  "verse": "Galatians 6:9",
                  "explanation": "And let us not be weary in well doing: for in due season we shall reap, if we faint not. This verse encourages perseverance in doing good. Dreaming about building and caring for an ant farm can be a reminder to continue working diligently and patiently, trusting that your efforts will yield positive results in due time."
                },
                {
                  "verse": "Matthew 25:21",
                  "explanation": "His lord said unto him, Well done, thou good and faithful servant: thou hast been faithful over a few things, I will make thee ruler over many things: enter thou into the joy of thy lord. This verse from the Parable of the Talents emphasizes faithfulness in small responsibilities leading to greater rewards. Your dream about caring for ants may signify your faithfulness in small tasks, suggesting that such diligence and care will lead to greater responsibilities and blessings in the future."
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