'use client'

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from 'react';
import { Card, Badge, Popover, Modal, Button, TextInput, Textarea } from 'flowbite-react';
import { DreamItem, Verse } from '@/types/dreamAnalysis';
import dayjs from 'dayjs';

interface OpenAIAnalysisCardProps {
  dream: DreamItem;
  onDelete: (id: string) => void;
  onUpdate: (updatedDream: DreamItem) => void;
  index: number;
}

const renderInterpretation = (dream: DreamItem): JSX.Element[] => {
  if (dream.explanations) {
    // New format
    return dream.explanations.map((explanation, index) => (
      <p key={index} className="mb-2">
        {explanation.sentence}{' '}
        <Popover content={
          <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
            <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">{explanation.citation.book}</h3>
            </div>
            <div className="px-3 py-2">
              <p>{explanation.citation.text}</p>
            </div>
          </div>
        } trigger="hover">
          <span className="text-blue-500 underline cursor-pointer">{explanation.citation.verse}</span>
        </Popover>
      </p>
    ));
  } else if (dream.dream_entries && dream.dream_entries[0]?.analysis) {
    // Old format
    const interpretation = dream.dream_entries[0].analysis;
    if (typeof interpretation === 'string') {
      const parts = interpretation.split(/(<popover>[^<]+<\/popover>)/g);

      return parts.map((part, index) => {
        if (part.startsWith('<popover>') && part.endsWith('</popover>')) {
          const verseReference = part.slice(9, -10);
          const verse = dream.verses.find(v => v.reference === verseReference);

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

const FullDreamModal: React.FC<{ dream: DreamItem; isOpen: boolean; onClose: () => void; onEdit: () => void; onDelete: () => void }> = ({ dream, isOpen, onClose, onEdit, onDelete }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer bg-slate-900/20 backdrop-blur p-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">{dream.title}</h3>
              <p className='italic text-center mb-4'>&quot;{dream.original_dream}&quot;</p>
              {dream.topic_sentence && <p className="mb-4">{dream.topic_sentence}</p>}
              {dream.interpretation_elements && dream.interpretation_elements.map((element, index) => (
                <p key={index} className="font-bold mb-2">{element.content}</p>
              ))}
              {dream.verses && dream.verses.map((verse: Verse, index: number) => (
                <p key={index} className="mb-2">
                  {verse.explanation}{' '}
                  <Popover content={
                    <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                      <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{verse.book}</h3>
                      </div>
                      <div className="px-3 py-2">
                        <p>{verse.text}</p>
                      </div>
                    </div>
                  } trigger="hover">
                    <span className="text-blue-500 underline cursor-pointer">{verse.reference}</span>
                  </Popover>
                </p>
              ))}
              <div className="flex flex-wrap gap-2 mb-4">
                {(dream.tags || []).concat(dream.dream_tags.map(dt => dt.tags.name)).map((tag, index) => (
                  <Badge key={index} color="indigo">#{tag.toLowerCase()}</Badge>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <Button color="light" onClick={onEdit}>
                  Edit
                </Button>
                <Button color="failure" onClick={onDelete}>
                  Delete
                </Button>
                <Button onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const EditDreamModal: React.FC<{ dream: DreamItem; isOpen: boolean; onClose: () => void; onSave: (updatedDream: DreamItem) => void }> = ({ dream, isOpen, onClose, onSave }) => {
  const [editedDream, setEditedDream] = useState<DreamItem>(dream);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedDream(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setEditedDream(prev => ({ 
      ...prev, 
      tags: tags,
      dream_tags: tags.map(tag => ({ tags: { name: tag, id: '' } }))
    }));
  };

  const handleSave = () => {
    onSave(editedDream);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer bg-slate-900/20 backdrop-blur p-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">Edit Dream Analysis</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                  <TextInput
                    id="title"
                    name="title"
                    value={editedDream.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {editedDream.topic_sentence && (
                  <div>
                    <label htmlFor="topic_sentence" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Topic Sentence</label>
                    <Textarea
                      id="topic_sentence"
                      name="topic_sentence"
                      value={editedDream.topic_sentence}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="interpretation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Interpretation</label>
                  <Textarea
                    id="interpretation"
                    name="interpretation"
                    value={editedDream.explanations 
                      ? JSON.stringify(editedDream.explanations, null, 2)
                      : typeof editedDream.dream_entries[0]?.analysis === 'string' 
                        ? editedDream.dream_entries[0].analysis 
                        : JSON.stringify(editedDream.dream_entries[0]?.analysis, null, 2)}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tags (comma-separated)</label>
                  <TextInput
                    id="tags"
                    name="tags"
                    value={(editedDream.tags || editedDream.dream_tags.map(tag => tag.tags.name)).join(', ')}
                    onChange={handleTagsChange}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button onClick={handleSave}>Save</Button>
                <Button color="gray" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
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
    } else if (dream.verses && dream.verses.length > 0) {
      return dream.verses[0].explanation;
    } else if (dream.title) {
      return dream.title;
    }
    return 'No interpretation available.';
  };

  return (
    <>
      <Card 
        className="animate-fade-up w-full cursor-pointer hover:shadow-lg transition-shadow duration-600 rounded-2xl"
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
          {(dream.tags || []).concat(dream.dream_tags.map(dt => dt.tags.name)).map((tag, index) => (
            <Badge key={index} color="indigo">#{tag}</Badge>
          ))}
        </div>
      </Card>
      <FullDreamModal 
        dream={dream} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditDreamModal 
        dream={dream} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSave={onUpdate}
      />
    </>
  );
};

export default OpenAIAnalysisCard;