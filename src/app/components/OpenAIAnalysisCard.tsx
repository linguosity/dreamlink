import React, { useState } from 'react';
import { Card, Badge, Popover, Modal } from 'flowbite-react';
import { DreamAnalysis, Verse } from '../types/dreamAnalysis';

interface DreamAnalysisCardProps {
  dream: DreamAnalysis;
}

interface PopoverContent {
  type: 'Popover';
  props: {
    trigger: 'hover';
    content: string;
    children: string[];
  };
}

type InterpretationElement = string | PopoverContent;

const renderInterpretation = (interpretation: string | InterpretationElement[], verses: Verse[]): JSX.Element[] => {
  if (typeof interpretation === 'string') {
    // Split the interpretation into parts, keeping both parenthesized references and bare references
    const parts = interpretation.split(/(\([^)]+\)|\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|1 Samuel|2 Samuel|1 Kings|2 Kings|1 Chronicles|2 Chronicles|Ezra|Nehemiah|Esther|Job|Psalms|Proverbs|Ecclesiastes|Song of Solomon|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|1 Corinthians|2 Corinthians|Galatians|Ephesians|Philippians|Colossians|1 Thessalonians|2 Thessalonians|1 Timothy|2 Timothy|Titus|Philemon|Hebrews|James|1 Peter|2 Peter|1 John|2 John|3 John|Jude|Revelation)\s+\d+(?::\d+)?(?:-\d+)?)/);
    
    return parts.map((part, index) => {
      // Check if the part is a reference (either parenthesized or bare)
      if (part.startsWith('(') && part.endsWith(')')) {
        part = part.slice(1, -1); // Remove parentheses
      }
      
      const verse = verses.find(v => v.reference === part || v.reference.includes(part));
      if (verse) {
        return (
          <Popover
            key={index}
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
            <span className="text-blue-500 underline cursor-pointer">{part}</span>
          </Popover>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }  else if (Array.isArray(interpretation)) {
    return interpretation.map((element, index) => {
      if (typeof element === 'string') {
        return <span key={index}>{element}</span>;
      } else if (element.type === 'Popover') {
        const verse = verses.find(v => v.reference === element.props.children[0]);
        return (
          <Popover
            key={index}
            trigger={element.props.trigger}
            content={
              <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{element.props.children[0]}</h3>
                </div>
                <div className="px-3 py-2">
                  <p>{verse ? verse.text : element.props.content}</p>
                </div>
              </div>
            }
          >
            <span className="text-blue-500 underline cursor-pointer">{element.props.children[0]}</span>
          </Popover>
        );
      }
      return null;
    }).filter((element): element is JSX.Element => element !== null);
  }
  return [];
};

const FullDreamModal: React.FC<{ dream: DreamAnalysis; isOpen: boolean; onClose: () => void }> = ({ dream, isOpen, onClose }) => {
  return (
    <Modal dismissible show={isOpen} onClose={onClose}>
      <Modal.Header>{dream.title}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Original Dream</h3>
          <p>{dream.originalDream}</p>
          <hr className="my-4" />
          <h3 className="text-lg font-semibold">Interpretation</h3>
          <div>{renderInterpretation(dream.interpretation, dream.verses)}</div>
          {dream.gematriaInterpretation && (
            <>
              <hr className="my-4" />
              <h3 className="text-lg font-semibold">Gematria Interpretation</h3>
              <p>{dream.gematriaInterpretation}</p>
            </>
          )}
          {dream.colorSymbolism && (
            <>
              <hr className="my-4" />
              <h3 className="text-lg font-semibold">Color Symbolism</h3>
              <p>{dream.colorSymbolism}</p>
            </>
          )}
          <hr className="my-4" />
          <h3 className="text-lg font-semibold">Verses (Tree of Life Version)</h3>
          {dream.verses.map((verse, index) => (
            <div key={index} className="mb-2">
              <strong>{verse.reference}:</strong> {verse.text}
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex flex-wrap gap-2 mt-4">
          {dream.tags.map((tag, index) => (
            <Badge key={index} color="indigo">#{tag}</Badge>
          ))}
        </div>
      </Modal.Footer>
    </Modal>
  );
};

const OpenAIAnalysisCard: React.FC<DreamAnalysisCardProps> = ({ dream }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const truncatedInterpretation = typeof dream.interpretation === 'string' 
    ? dream.interpretation.split('.')[0] + '.'
    : dream.interpretation.slice(0, 1);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="w-full cursor-pointer hover:shadow-lg transition-shadow duration-300" onClick={handleCardClick}>
        <h5 className="text-lg font-bold mb-2">{dream.title}</h5>
        <div className="mb-4">
          {renderInterpretation(truncatedInterpretation, dream.verses)}
        </div>
        {dream.gematriaInterpretation && (
          <div className="mb-2">
            <Badge color="purple">Gematria</Badge>
          </div>
        )}
        {dream.colorSymbolism && (
          <div className="mb-2">
            <Badge color="yellow">Color Symbolism</Badge>
          </div>
        )}
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

export default OpenAIAnalysisCard;