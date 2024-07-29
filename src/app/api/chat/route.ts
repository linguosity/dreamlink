import OpenAI from "openai";
import { StreamingTextResponse } from 'ai';

const openai = new OpenAI();

export const runtime = 'edge';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('Received request body:', JSON.stringify(body, null, 2));

  const { messages, useJsonMode = false } = body;
  console.log('Extracted messages:', JSON.stringify(messages, null, 2));
  console.log('useJsonMode:', useJsonMode);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: useJsonMode 
          ? "You are a helpful assistant designed to output JSON. Analyze dreams and provide meanings from the King James Bible with supporting verses."
          : "You are a helpful assistant.",
      },
      ...messages
    ],
    ...(useJsonMode && { response_format: { type: "json_object" } }),
    stream: true,
  });

  console.log('OpenAI API call made with parameters:', JSON.stringify({
    model: "gpt-4o-mini",
    messages: messages,
    useJsonMode: useJsonMode
  }, null, 2));

  const stream = new ReadableStream({
    async start(controller) {
      const stream = response as any;
      for await (const part of stream) {
        const chunk = part.choices[0]?.delta?.content || '';
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });

  return new StreamingTextResponse(stream);
}