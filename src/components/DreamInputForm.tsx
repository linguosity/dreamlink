'use client';

import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { DreamItem } from '@/types/dreamAnalysis';
import { Expand, Send } from 'lucide-react';

interface DreamInputFormProps {
  userId: string;
  userFullName: string;
  onAddDream: (dream: DreamItem) => void;
  onSubmit: (dreamText: string) => Promise<boolean>;
}

export default function DreamInputForm({ userId, userFullName, onAddDream, onSubmit }: DreamInputFormProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setIsLoading(true);
    const success = await onSubmit(input);
    setIsLoading(false);
    if (success) {
      setInput('');
      setIsModalOpen(false);
      router.refresh();
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <textarea
              id="dream"
              placeholder="Share your dream journey..."
              required
              value={input}
              onChange={handleInputChange}
              rows={1}
              aria-label="Dream input"
              className="
                block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300
                focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400
                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                resize-none
              "
            />

            {/* Button group container */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
              {/* Expand Button (like the gray dropdown button) */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="
                  inline-flex items-center p-2.5 text-sm font-medium text-gray-900 bg-gray-100 
                  border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 
                  focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:border-gray-600 
                  dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700
                "
                title="Expand editor"
              >
                <Expand className="w-4 h-4" />
              </button>

              {/* Send Button (like the blue search button) */}
              <button
                type="submit"
                disabled={isLoading}
                className="
                  inline-flex items-center p-2.5 text-sm font-medium text-white bg-blue-700 
                  border border-blue-700 rounded-r-lg hover:bg-blue-800 focus:ring-4 focus:outline-none 
                  focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
                "
                title="Submit dream"
              >
                {isLoading ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </form>

      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="5xl">
        <Modal.Header>Share Your Dream Journey</Modal.Header>
        <Modal.Body>
          <textarea
            placeholder="Enter your dream in detail..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            className="
              w-full p-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400
              dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
              dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
            "
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className="
              inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700
              border border-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none
              focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
            "
          >
            {isLoading ? <Spinner size="sm" /> : 'Submit Dream'}
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="
              inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200
              border border-gray-300 rounded-lg hover:bg-gray-300 focus:ring-4 focus:outline-none
              focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white 
              dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-gray-700
            "
          >
            Cancel
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}