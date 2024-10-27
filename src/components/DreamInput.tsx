// src/components/DreamInput.tsx

'use client'; // Indicates that this is a client-side component

import React, { useState } from 'react';
import { Button, Modal, Textarea, Spinner } from 'flowbite-react'; // Import UI components
import { Send } from 'lucide-react'; // Modern, clean icon set

interface DreamInputProps {
  onSubmit: (dreamText: string) => Promise<boolean>; // Function to handle dream submission
  userFullName: string; // The full name of the user
}

// This component provides a button to open a modal for dream input
export default function DreamInput({ onSubmit, userFullName }: DreamInputProps) {
  const [isOpen, setIsOpen] = useState(false); // State to control the visibility of the modal
  const [input, setInput] = useState(''); // State to hold the dream text input
  const [isLoading, setIsLoading] = useState(false); // State to indicate loading status

  // Function to handle changes in the dream input field
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Function to handle the submission of the dream
  const handleSubmit = async () => {
    setIsLoading(true); // Set loading state to true
    const success = await onSubmit(input); // Call the onSubmit function passed from props
    setIsLoading(false); // Set loading state to false
    if (success) {
      setInput(''); // Clear the input field
      setIsOpen(false); // Close the modal
    }
  };

  return (
    <>
      {/* Button to open the modal */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 flex items-center justify-center z-40"
      >
        +
      </Button>

      {/* Modal for entering the dream */}
      <Modal show={isOpen} onClose={() => setIsOpen(false)} size="xl">
        <Modal.Header>Add New Dream</Modal.Header>
        <Modal.Body>
          <p className="mb-2">Adding dream for: {userFullName}</p>
          {/* Textarea for entering the dream */}
          <Textarea
            id="dream"
            placeholder="Share your dream journey..."
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            className="w-full p-4 text-lg bg-white/10 backdrop-blur-sm rounded-xl 
                       border border-gray-300 focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent resize-none transition-all duration-200
                       text-white placeholder-white/50"
          />
        </Modal.Body>
        <Modal.Footer>
          {/* Submit Button */}
          <Button
            type="submit"
            size="sm"
            disabled={isLoading}
            className="p-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-200 border-0"
            title="Submit dream"
          >
            {isLoading ? <Spinner size="sm" /> : <Send className="w-5 h-5 text-white" />}
          </Button>
          {/* Cancel Button */}
          <Button
            type="button"
            size="sm"
            color="gray"
            onClick={() => setIsOpen(false)}
            className="p-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-200 border-0"
            title="Cancel"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
