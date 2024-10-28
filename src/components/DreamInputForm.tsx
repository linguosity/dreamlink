// src/components/DreamInputForm.tsx

'use client'; // Indicates that this is a client-side component

import React, { useState } from 'react';
import { Button, Modal, Spinner } from 'flowbite-react'; // Import UI components
import { useRouter } from 'next/navigation'; // Import router for navigation actions
import { DreamItem } from '@/types/dreamAnalysis'; // Import from dreamAnalysis.ts
import { Expand, Send } from 'lucide-react'; // Add this import

interface DreamInputFormProps {
  userId: string; // The ID of the current user
  userFullName: string; // The full name of the user
  onAddDream: (dream: DreamItem) => void; // Function to call when a new dream is added
  onSubmit: (dreamText: string) => Promise<boolean>; // Function to handle dream submission
}

// This component renders the form for inputting a new dream
export default function DreamInputForm({ userId, userFullName, onAddDream, onSubmit }: DreamInputFormProps) {
  const [input, setInput] = useState(''); // State to hold the dream text input
  const [isLoading, setIsLoading] = useState(false); // State to indicate loading status
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const router = useRouter(); // Router for navigation or refreshing the page

  // Function to handle changes in the dream input field
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault(); // Prevent the default form submission behavior
    setIsLoading(true); // Set loading state to true
    const success = await onSubmit(input); // Call the onSubmit function passed from props
    setIsLoading(false); // Set loading state to false
    if (success) {
      setInput(''); // Clear the input field
      setIsModalOpen(false); // Close the modal
      router.refresh(); // Refresh the page or perform additional actions
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto px-8 mt-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <textarea
              id="dream"
              placeholder="Share your dream journey..."
              required
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              aria-label="Dream input"
              className="w-full p-4 text-lg bg-transparent text-white backdrop-blur-sm rounded-xl 
                         border border-white/20 focus:ring-2 focus:ring-blue-500/50 
                         focus:border-transparent resize-none transition-all duration-200
                         placeholder-white/50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <Button
                type="button"
                size="sm"
                color="gray"
                onClick={() => setIsModalOpen(true)}
                className="p-2 bg-transparent hover:bg-white/5 backdrop-blur-sm transition-all duration-200 border-0"
                title="Expand editor"
              >
                <Expand className="w-5 h-5 text-white" />
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isLoading}
                className="p-2 bg-transparent hover:bg-white/5 backdrop-blur-sm transition-all duration-200 border-0"
                title="Submit dream"
              >
                {isLoading ? <Spinner size="sm" /> : <Send className="w-5 h-5 text-white" />}
              </Button>
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
            className="w-full p-6 text-lg rounded-lg border border-gray-300 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       min-h-[400px]"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button 
            onClick={() => handleSubmit()} 
            disabled={isLoading}
            size="xl"
            className="px-8 py-3 text-lg"
          >
            {isLoading ? <Spinner size="sm" /> : 'Submit Dream'}
          </Button>
          <Button color="gray" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
