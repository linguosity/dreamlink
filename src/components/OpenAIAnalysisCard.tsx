'use client'

import React, { useState, type JSX, useEffect } from 'react';
import { AnimatePresence, motion, HTMLMotionProps } from "framer-motion";
import { CloudIcon } from '@heroicons/react/24/outline';
import { Card, Badge, Popover, Modal, Button, TextInput, Textarea, HR } from 'flowbite-react';
import { DreamItem, Verse, Explanation } from '@/types/dreamAnalysis';
import dayjs from 'dayjs';
import { MotionDiv } from '@/lib/motion';

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
  onTagClick: (tag: string) => void;
  index: number;
}

const OpenAIAnalysisCard: React.FC<OpenAIAnalysisCardProps> = ({ dream, onDelete, onUpdate, onTagClick, index }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    console.log('Modal state changed:', openModal);
  }, [openModal]);

  const renderInterpretation = (dream: DreamItem, isModal: boolean = false): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    // Add topic sentence from interpretation_elements without truncation
    if (dream.interpretation_elements?.[0]?.content) {
      const content = dream.interpretation_elements[0].content;
      elements.push(
        <div key="topic" className="mb-4 font-medium text-gray-900 dark:text-white">
          {content}
        </div>
      );
    }

    // Only add verses with explanations if we're in the modal
    if (isModal && dream.verses && dream.verses.length > 0) {
      dream.verses.forEach((verse, index) => {
        elements.push(
          <div key={index} className="mb-2">
            {verse.explanation}{' '}
            <Popover
              content={
                <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                  <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{verse.book}</h3>
                  </div>
                  <div className="px-3 py-2">
                    <span>{verse.text}</span>
                  </div>
                </div>
              }
              trigger="hover"
            >
              <span className="text-blue-500 underline cursor-pointer">{verse.reference}</span>
            </Popover>
          </div>
        );
      });
    }

    return elements;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    console.log('=== Card Click Debug ===');
    console.log('Event target:', e.target);
    console.log('Current target:', e.currentTarget);
    console.log('Is tag badge?:', !!(e.target as HTMLElement).closest('[data-tag-badge="true"]'));
    console.log('Modal state before:', openModal);
    
    if (!(e.target as HTMLElement).closest('[data-tag-badge="true"]')) {
      console.log('Setting modal to open');
      setOpenModal(true);
      console.log('Modal state after set:', openModal);
    }
  };

  const handleEdit = () => {
    setOpenModal(false);
    setOpenEditModal(true);
  };

  const handleDelete = () => {
    onDelete(dream.id);
  };

  return (
    <>
      <Card className="w-full h-full flex flex-col">
        <div 
          onClick={handleCardClick}
          className="flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors p-4"
        >
          <span className="block font-normal text-sm text-yellow-600 italic dark:text-gray-400">
            {dream.created_at 
              ? dayjs(dream.created_at).format('MMMM D, YYYY')
              : 'Date unknown'}
          </span>
          <h3 className="text-lg font-medium mb-2">{dream.title}</h3>
          <div className="mb-4 font-light">
            {renderInterpretation(dream, false)}
          </div>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex flex-wrap gap-2 mb-2">
            {(dream.tags || []).concat(dream.dream_tags?.map(dt => dt.tags.name) || []).map((tag, index) => (
              <Badge 
                key={index} 
                color="indigo" 
                data-tag-badge="true"
                className="cursor-pointer hover:bg-indigo-600 transition-colors dream-tag-badge"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
              >
                #{tag}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-gray-400 italic">
            {`${getBibleVersionFullName(dream.bible_version)} | ${dream.language}`}
          </div>
        </div>
      </Card>

      {openModal && (
        <Modal
          show={true}
          onClose={() => setOpenModal(false)}
          size="7xl"
          dismissible
          popup={false}
        >
          <Modal.Header>
            {dream.title}
          </Modal.Header>
          <Modal.Body>
            <p className="mb-4 text-center">{dream.original_dream}</p>
            <HR />
            <h4 className="font-semibold mb-2">Interpretation:</h4>
            <div className="mb-4">
              {renderInterpretation(dream, true)}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleEdit}>
              Edit
            </Button>
            <Button color="failure" onClick={handleDelete}>
              Delete
            </Button>
            <Button color="gray" onClick={() => setOpenModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal
        show={openEditModal}
        onClose={() => setOpenEditModal(false)}
        size="xl"
      >
        <Modal.Header>Edit Dream</Modal.Header>
        <Modal.Body>
          {/* Add your edit form here */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenEditModal(false)}>
            Save
          </Button>
          <Button color="gray" onClick={() => setOpenEditModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OpenAIAnalysisCard;
