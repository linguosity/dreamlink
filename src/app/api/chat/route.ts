import OpenAI from "openai";
import { StreamingTextResponse } from 'ai';

const openai = new OpenAI();

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, useJsonMode = false } = await req.json();

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

  const stream = new ReadableStream({
    async start(controller) {
      // Use type assertion here
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