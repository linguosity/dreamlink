import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY as string;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not set in the environment variables");
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export default openai;
