import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON. Analyze dreams and provide meanings from the King James Bible with supporting verses. Your response should always include 'dream', 'meaning', and 'interpretation' fields. The 'interpretation' field should be an array of objects, each containing 'verse' and 'explanation' fields.",
      },
      ...messages
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}