'use client'

import React, { useEffect } from 'react';
import { Card, TextInput, Button, Spinner, Badge, Accordion } from 'flowbite-react';
import { useChat } from 'ai/react';

interface DreamAnalysis {
  title: string;
  summary: string;
  tags: string[];
  interpretation: Array<{ verse: string; explanation: string; book: string }>;
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
          <h5 className="text-base font-bold mb-2">{analysis.title}</h5>
          <div className="flex flex-wrap gap-2 mb-4">
            <span>{analysis.summary}</span>
            {analysis.tags.map((tag, index) => (
              <Badge key={index} color="indigo">{tag}</Badge>
            ))}
          </div>
          <Accordion>
            {analysis.interpretation.map((item, index) => (
              <Accordion.Panel key={index}>
                <Accordion.Title>{item.verse}</Accordion.Title>
                <Accordion.Content>
                  <p className="mb-2 text-gray-500 dark:text-gray-400">{item.explanation}</p>
                  <Badge color="dark">{item.book}</Badge>
                </Accordion.Content>
              </Accordion.Panel>
            ))}
          </Accordion>
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