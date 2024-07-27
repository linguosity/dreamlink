import React, { useState } from 'react';
import { Card, TextInput, Button, Spinner } from 'flowbite-react';

interface AnalysisResponse {
  dream: string;
  meaning: string;
  interpretation: Array<{ verse: string; explanation: string }>;
}

export default function DreamAnalysisCard() {
  const [dream, setDream] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submitting dream:', dream);
    try {
      console.log('Sending request to API');
      const response = await fetch('/api/analyze-dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: dream }),
      });
      
      console.log('Received response from API, status:', response.status);
      const data: AnalysisResponse = await response.json();
      console.log('Parsed response data:', data);
      
      if (response.ok) {
        const interpretationText = data.interpretation
          .map(item => `${item.verse}: ${item.explanation}`)
          .join('\n\n');

        setAnalysis(
          `Dream: ${data.dream}\n\n` +
          `Meaning: ${data.meaning}\n\n` +
          `Biblical Interpretation:\n${interpretationText}`
        );
      } else {
        console.error('API error:', data);
        setAnalysis(`An error occurred: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setAnalysis('An error occurred while analyzing your dream.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-sm">
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center">
          <TextInput
            id="dream"
            type="text"
            placeholder="Enter your dream"
            required
            value={dream}
            onChange={(e) => setDream(e.target.value)}
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