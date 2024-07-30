'use client'

import React, { useEffect } from 'react';
import { Card, TextInput, Button, Spinner } from 'flowbite-react';
import { useChat } from 'ai/react';

interface DreamAnalysis {
  interpretation: Array<{ verse: string; explanation: string }>;
}

export default function DreamAnalysisCard() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat',
    onResponse: async (response) => {
      console.log('API Response received:', response);
      if (response.ok) {
        const responseData = await response.json();
        console.log('Parsed API response:', responseData);
        // Manually add the assistant's message to the messages array
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            role: 'assistant',
            content: JSON.stringify(responseData),
          },
        ]);
      } else {
        console.error('API response not ok:', response.statusText);
      }
    },
  });

  useEffect(() => {
    console.log('Messages updated:', messages);
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      console.log('Last message:', lastMessage);
      if (lastMessage.role === 'assistant') {
        console.log('Assistant response received:', lastMessage.content);
        const parsedAnalysis = parseAnalysis(lastMessage.content);
        console.log('Parsed analysis:', parsedAnalysis);
      }
    }
  }, [messages]);

  const parseAnalysis = (content: string): DreamAnalysis | null => {
    console.log('Attempting to parse content:', content);
    try {
      const parsed = JSON.parse(content);
      console.log('Successfully parsed content:', parsed);
      return parsed;
    } catch (error) {
      console.error('Failed to parse analysis:', error);
      return null;
    }
  };

  const lastMessage = messages[messages.length - 1];
  console.log('Last message:', lastMessage);

  const analysis = lastMessage?.role === 'assistant' ? parseAnalysis(lastMessage.content) : null;
  console.log('Parsed analysis:', analysis);

  return (
    <div className="space-y-4">
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
      </Card>

      {isLoading && (
        <Card className="max-w-sm">
          <p>Analyzing your dream...</p>
        </Card>
      )}

{analysis && (
      <Card className="max-w-sm">
        <h5 className="text-lg font-bold mb-2">Dream Analysis:</h5>
        {analysis.interpretation.map((item, index) => (
          <div key={index} className="mt-2">
            <p><strong>Verse:</strong> {item.verse}</p>
            <p><strong>Explanation:</strong> {item.explanation}</p>
          </div>
        ))}
      </Card>
    )}

    {!isLoading && lastMessage?.role === 'assistant' && !analysis && (
      <Card className="max-w-sm">
        <p className="text-red-500">Failed to parse the analysis. Please try again.</p>
      </Card>
    )}
  </div>
);
}