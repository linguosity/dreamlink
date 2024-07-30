'use client'

import React from 'react';
import { Card, TextInput, Button, Spinner } from 'flowbite-react';
import { useChat } from 'ai/react';

interface DreamAnalysis {
  dream: string;
  meaning: string;
  interpretation: Array<{ verse: string; explanation: string }>;
}

export default function DreamAnalysisCard() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  const parseAnalysis = (content: string): DreamAnalysis | null => {
    try {
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to parse analysis:', error);
      return null;
    }
  };

  const analysis = messages.length > 1 ? parseAnalysis(messages[messages.length - 1].content) : null;

  return (
    <Card className="max-w-sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center">
          <TextInput
            id="dream"
            type="text"
            placeholder="Enter your dream"
            required
            value={input}
            onChange={handleInputChange}
            className="flex-grow"
          />
          <Button type="submit" className="ml-2">
            {isLoading ? <Spinner size="sm" /> : 'Analyze'}
          </Button>
        </div>
      </form>
      {isLoading && <p>Analyzing your dream...</p>}
      {analysis && (
        <div className="mt-4">
          <h5 className="text-lg font-bold">Dream Analysis:</h5>
          <p><strong>Dream:</strong> {analysis.dream}</p>
          <p className="mt-2"><strong>Meaning:</strong> {analysis.meaning}</p>
          <h6 className="mt-4 font-semibold">Biblical Interpretations:</h6>
          <ul className="list-disc pl-5">
            {analysis.interpretation.map((item, index) => (
              <li key={index} className="mt-2">
                <p><strong>{item.verse}:</strong> {item.explanation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isLoading && messages.length > 1 && !analysis && (
        <p className="text-red-500">Failed to parse the analysis. Please try again.</p>
      )}
    </Card>
  );
}