'use client'

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from 'react';
import { CloudIcon } from '@heroicons/react/24/outline';
import { Card, Badge, Popover, Modal, Button, TextInput, Textarea, HR } from 'flowbite-react';
import { DreamItem, Verse, Explanation } from '@/types/dreamAnalysis';
import dayjs from 'dayjs';

const getBibleVersionFullName = (code: string): string => {
  const versions: { [key: string]: string } = {
    'KJV': 'King James Version',
    'NIV': 'New International Version',
    'ESV': 'English Standard Version',
    'NLT': 'New Living Translation',
    'TOL': 'Tree of Life',
  };
  return versions[code] || code;
};

interface OpenAIAnalysisCardProps {
  dream: DreamItem;
  onDelete: (id: string) => void;
  onUpdate: (updatedDream: DreamItem) => void;
  index: number;
}

const renderInterpretation = (dream: DreamItem): JSX.Element[] => {
  if (dream.explanations) {
    // New format
    return dream.explanations.map((explanation: Explanation, index: number) => (
      <p key={index} className="mb-2">
        {explanation.sentence}{' '}
        <Popover
          content={
            <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
              <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">{explanation.citation.book}</h3>
              </div>
              <div className="px-3 py-2">
                <p>{explanation.citation.text}</p>
              </div>
            </div>
          }
          trigger="hover"
        >
          <span className="text-blue-500 underline cursor-pointer">{explanation.citation.verse}</span>
        </Popover>
      </p>
    ));
  } else if (dream.dream_entries?.[0]?.analysis) {
    // Old format
    const interpretation = dream.dream_entries[0].analysis;
    if (typeof interpretation === 'string') {
      const parts = interpretation.split(/(<popover>[^<]+<\/popover>)/g);

      return parts.map((part, index) => {
        if (part.startsWith('<popover>') && part.endsWith('</popover>')) {
          const verseReference = part.slice(9, -10);
          const verse = dream.verses?.find(v => v.reference === verseReference);

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
                <span className="text-blue-500 underline cursor-pointer">{verse.reference}</span>
              </Popover>
            );
          }
        }
        return <span key={index}>{part}</span>;
      });
    }
  }

  return [];
};

const OpenAIAnalysisCard: React.FC<OpenAIAnalysisCardProps> = ({ dream, onDelete, onUpdate, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const formattedDate = dream.created_at 
    ? dayjs(dream.created_at).format('MMMM D, YYYY')
    : 'Date unknown';

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsModalOpen(false);
    onDelete(dream.id);
  };

  const renderInterpretationPreview = () => {
    if (dream.interpretation_elements && dream.interpretation_elements.length > 0) {
      return dream.interpretation_elements[0].content;
    } else if (dream.verses?.length) {
      return dream.verses[0].explanation;
    } else if (dream.title) {
      return dream.title;
    }
    return 'No interpretation available.';
  };

  return (
    <>
      <Card 
        className="animate-fade-up w-full cursor-pointer hover:shadow-lg transition-shadow duration-600 animate-delay-[123ms] rounded-2xl"
        onClick={handleCardClick}
      >
        <span className="font-normal text-sm text-yellow-600 italic dark:text-gray-400">
          {formattedDate}
        </span>
        <h3 className="text-lg font-medium mb-2">{dream.title}</h3>
        <div className="mb-4 font-light">
          {renderInterpretationPreview()}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {(dream.tags || []).concat(dream.dream_tags?.map(dt => dt.tags.name) || []).map((tag, index) => (
            <Badge key={index} color="indigo">#{tag}</Badge>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-400 italic">
          {`${getBibleVersionFullName(dream.bible_version)} | ${dream.language}`}
        </div>
      </Card>

      {/* Dream details modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="xl">
        <Modal.Header>{dream.title}</Modal.Header>
        <Modal.Body>
          {dream.topic_sentence && (
            <p className="mb-4 font-semibold">{dream.topic_sentence}</p>
          )}


          <p className="flex text-center justify-center gap-2 mb-4"><CloudIcon className="size-6" /></p>
          <p className="mb-4 text-center">{dream.original_dream}</p>
          <HR />
          <h4 className="font-semibold mb-2">Interpretation:</h4>
          <div className="mb-4">{renderInterpretation(dream)}</div>
          {dream.interpretation_elements && dream.interpretation_elements.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Additional Interpretation:</h4>
              {dream.interpretation_elements.map((element, index) => (
                <p key={index} className="mb-2">
                  {element.content}
                  {element.is_popover && element.popover_content && (
                    <Popover
                      content={
                        <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                          <div className="px-3 py-2">
                            <p>{element.popover_content}</p>
                          </div>
                        </div>
                      }
                      trigger="hover"
                    >
                      <span className="text-blue-500 underline cursor-pointer"> (More info)</span>
                    </Popover>
                  )}
                </p>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-4">
            {(dream.tags || []).concat(dream.dream_tags?.map(dt => dt.tags.name) || []).map((tag, index) => (
              <Badge key={index} color="indigo">#{tag}</Badge>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleEdit}>Edit</Button>
          <Button color="failure" onClick={handleDelete}>Delete</Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="xl">
        <Modal.Header>Edit Dream</Modal.Header>
        <Modal.Body>
          {/* Add form fields for editing the dream here */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {
            // Handle save logic here
            setIsEditModalOpen(false);
          }}>Save</Button>
          <Button color="gray" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OpenAIAnalysisCard;
