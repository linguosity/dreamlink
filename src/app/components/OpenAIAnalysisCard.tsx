import React, { useState } from 'react';
import { Card, Badge, Popover, Modal, Button } from 'flowbite-react';

interface Verse {
  reference: string;
  text: string;
}

interface DreamAnalysis {
  title: string;
  interpretation: string;
  tags: string[];
  verses: Verse[];
  originalDream: string;
}

interface DreamAnalysisCardProps {
  dream: DreamAnalysis;
}

const replaceSymbolWithPopover = (interpretation: string, verses: Verse[]): (JSX.Element | string)[] => {
  let elements = interpretation.split(/(\$.*?\$)/g);
  let index = 0;

  return elements.map((element, i) => {
    if (element.startsWith('$') && element.endsWith('$')) {
      const reference = element.slice(1, -1);
      const verse = verses.find(v => v.reference === reference);

      if (verse) {
        return (
          <Popover
            key={index++}
            trigger="hover"
            content={
              <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{verse.reference}</h3>
                </div>
                <div className="px-3 py-2">
                  <p>{verse.text}</p>
                </div>
              </div>
            }
          >
            <span className="text-blue-500 underline cursor-pointer">{reference}</span>
          </Popover>
        );
      }
    }
    return element;
  });
};

const FullDreamModal: React.FC<{ dream: DreamAnalysis; isOpen: boolean; onClose: () => void }> = ({ dream, isOpen, onClose }) => {
  const interpretationWithPopovers = replaceSymbolWithPopover(dream.interpretation, dream.verses);

  return (
    <Modal dismissible show={isOpen} onClose={onClose}>
      <Modal.Header>{dream.title}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Original Dream</h3>
          <p>{dream.originalDream}</p>
          <hr className="my-4" />
          <h3 className="text-lg font-semibold">Interpretation</h3>
          <div>{interpretationWithPopovers}</div>
          
        </div>
      </Modal.Body>
      <Modal.Footer>
      <div className="flex flex-wrap gap-2 mt-4">
            {dream.tags.map((tag, index) => (
              <Badge key={index} color="indigo">#{tag}</Badge>
            ))}
          </div>
       {/*  <Button onClick={onClose}>Close</Button> */}
      </Modal.Footer>
    </Modal>
  );
};

const DreamAnalysisCard: React.FC<DreamAnalysisCardProps> = ({ dream }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const topicSentence = dream.interpretation.split('.')[0] + '.';
  const truncatedInterpretation = replaceSymbolWithPopover(topicSentence, dream.verses);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="w-full cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={handleCardClick}>
        <h5 className="text-lg font-bold mb-2">{dream.title}</h5>
        <div className="mb-4">
          {truncatedInterpretation}
        </div>
        <div className="flex flex-wrap gap-2">
          {dream.tags.map((tag, index) => (
            <Badge key={index} color="indigo">#{tag}</Badge>
          ))}
        </div>
      </Card>
      <FullDreamModal dream={dream} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default DreamAnalysisCard;