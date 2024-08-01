import React from 'react';
import { Card, Badge, Popover } from 'flowbite-react';

interface DreamInterpretation {
  verse: string;
  text: string;
  explanation: string;
  book: string;
}

interface DreamAnalysis {
  title: string;
  summary: string;
  tags: string[];
  interpretation: DreamInterpretation[];
}

interface DreamAnalysisCardProps {
  dream: DreamAnalysis;
}

const replaceSymbolWithPopover = (summary: string, interpretations: DreamInterpretation[]) => {
  let elements = summary.split(/(\$.*?\$)/g); // Split by symbols
  let index = 0;

  return elements.map((element, i) => {
    if (element.startsWith('$') && element.endsWith('$')) {
      const verse = element.slice(1, -1);
      const interpretation = interpretations.find(interp => interp.verse === verse);

      if (interpretation) {
        return (
          <Popover
            key={index++}
            trigger="hover"
            content={
              <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
              <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">{interpretation.verse}</h3>
              </div>
              <div className="px-3 py-2">
                <p>{interpretation.explanation}</p>
              </div>
            </div>
            }
          >
            <span className="text-blue-500 underline">{verse}</span>
          </Popover>
        );
      }
    }
    return element; // If not a symbol, return the element as is
  });
};

const DreamAnalysisCard: React.FC<DreamAnalysisCardProps> = ({ dream }) => {
  const summaryWithPopovers = replaceSymbolWithPopover(dream.summary, dream.interpretation);

  return (
    <Card className="w-full">
      <h5 className="text-lg font-bold mb-2">{dream.title}</h5>
      <div>
        {summaryWithPopovers}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {dream.tags.map((tag, index) => (
          <Badge key={index} color="indigo">#{tag}</Badge>
        ))}
      </div>
    </Card>
  );
};

export default DreamAnalysisCard;
