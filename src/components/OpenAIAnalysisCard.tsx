'use client'

import React, { useState, type JSX, useEffect } from 'react';
import { AnimatePresence, motion, HTMLMotionProps } from "framer-motion";
import { CloudIcon } from '@heroicons/react/24/outline';
import { Card, Badge, Popover, Modal, Button, TextInput, Textarea, HR, Tabs } from 'flowbite-react';
import { DreamItem, Verse, Explanation } from '@/types/dreamAnalysis';
import dayjs from 'dayjs';
import { MotionDiv } from '@/lib/motion';

type MotionDivProps = React.HTMLAttributes<HTMLDivElement> & HTMLMotionProps<"div">;

const Backdrop: React.FC<MotionDivProps> = motion.div;
const ModalContent: React.FC<MotionDivProps> = motion.div;

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

const backdropVariants = {
  hidden: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  visible: {
    opacity: 1,
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    backdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    y: '-100vh',
  },
  visible: {
    opacity: 1,
    y: '0',
    transition: {
      duration: 0.3,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
    y: '100vh',
    transition: {
      duration: 0.3,
    },
  },
};

const OpenAIAnalysisCard: React.FC<OpenAIAnalysisCardProps> = ({ dream, onDelete, onUpdate, onTagClick, index }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    console.log('Modal state changed:', openModal);
  }, [openModal]);

  useEffect(() => {
    if (openModal) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [openModal]);

  const renderInterpretation = (dream: DreamItem, isModal: boolean = false): JSX.Element[] => {
    const elements: JSX.Element[] = [];

    if (dream.interpretation_elements && dream.interpretation_elements.length > 0) {
      if (isModal) {
        // For modal view: Show full interpretation with embedded verse references
        const verses = dream.verses ?? [];
        elements.push(
          <div key="interpretation" className="font-medium text-gray-900 dark:text-white mb-4">
            {dream.interpretation_elements[0].content}
            {verses.map((verse, index) => (
              <React.Fragment key={`verse-${index}`}>
                {' '}{verse.explanation}{' '}
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
              </React.Fragment>
            ))}
          </div>
        );
      } else {
        // For card view: Show only the main interpretation
        elements.push(
          <div key="interpretation" className="font-medium text-gray-900 dark:text-white mb-4">
            {dream.interpretation_elements[0].content}
          </div>
        );
      }
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

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          document.body.style.overflow = 'auto';
        }}
      >
        {openModal && (
          <Backdrop
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              willChange: 'backdrop-filter, opacity',
            }}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setOpenModal(false)}
          >
            <ModalContent
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: 'relative',
                zIndex: 50,
                width: '50vw',
                minWidth: '400px',
                maxWidth: '90%',
                margin: '20px',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{dream.title}</h3>
                <button
                  onClick={() => setOpenModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <Tabs>
                <Tabs.Item active title="Interpretation">
                  {renderInterpretation(dream, true)}
                </Tabs.Item>
                <Tabs.Item title="Original Dream">
                  <div className="prose dark:prose-invert max-w-none">
                    <span className="block text-sm text-gray-500 mb-2">
                      {dayjs(dream.created_at).format('MMMM D, YYYY')}
                    </span>
                    <div className="whitespace-pre-wrap">
                      {dream.original_dream}
                    </div>
                  </div>
                </Tabs.Item>
              </Tabs>

              <div className="flex justify-end gap-2 mt-4">
                <Button onClick={handleEdit}>Edit</Button>
                <Button color="failure" onClick={handleDelete}>Delete</Button>
                <Button color="gray" onClick={() => setOpenModal(false)}>Close</Button>
              </div>
            </ModalContent>
          </Backdrop>
        )}
      </AnimatePresence>

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
