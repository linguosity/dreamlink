import React from 'react';
import { Card, Badge, Accordion } from 'flowbite-react';


interface DreamAnalysis {
  title: string;
  summary: string;
  tags: string[];
  interpretation: Array<{ verse: string; explanation: string; book: string }>;
}

interface DreamAnalysisCardProps {
  dream: DreamAnalysis;
}

export default function DreamAnalysisCard({ dream }: DreamAnalysisCardProps) {
  return (
    <Card className="w-full">
      <h5 className="text-lg font-bold mb-2">{dream.title}</h5>
      <p className="mb-2">{dream.summary}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {dream.tags.map((tag, index) => (
          <Badge key={index} color="info">{tag}</Badge>
        ))}
      </div>
      <Accordion>
        {dream.interpretation.map((item, index) => (
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
  );
}