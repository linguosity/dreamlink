import { NextResponse } from 'next/server';
import OpenAI from 'openai';

console.log('All environment variables:', Object.keys(process.env));
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
console.log('OPENAI_API_KEY in route file:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log('POST request received');
  try {
    const { text } = await req.json();
    console.log('Received text:', text);

    if (!text) {
      console.log('No text provided');
      return NextResponse.json({ error: 'Text input is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 });
    }

    console.log('Sending request to OpenAI');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant designed to output JSON. Analyze dreams and provide meanings from the King James Bible with supporting verses. Your response should always include 'dream', 'meaning', and 'interpretation' fields. The 'interpretation' field should be an array of objects, each containing 'verse' and 'explanation' fields.",
        },
        {
          role: "user",
          content: `Analyze the following dream and provide the best meaning from the King James Bible with supporting verses: ${text}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    console.log('Received response from OpenAI');
    const content = completion.choices[0].message.content;
    console.log('OpenAI response content:', content);

    // Parse the JSON string to an object
    const result = JSON.parse(content as string);
    console.log('Parsed result:', result);

    // Ensure the result has the expected structure
    if (!result.dream || !result.meaning || !Array.isArray(result.interpretation)) {
      throw new Error('OpenAI response does not have the expected structure');
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in analyze-dream API route:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}