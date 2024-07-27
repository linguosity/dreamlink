'use client'

import React from 'react';
import { Card, TextInput, Button, Spinner } from 'flowbite-react';
import { useChat } from 'ai/react';

export default function DreamAnalysisCard() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  const analysis = messages.length > 1 ? messages[messages.length - 1].content : null;

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
      {analysis && (
        <div className="mt-4">
          <h5 className="text-lg font-bold">Analysis:</h5>
          <p style={{ whiteSpace: 'pre-wrap' }}>{analysis}</p>
        </div>
      )}
    </Card>
  );
}