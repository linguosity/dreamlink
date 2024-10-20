// src/components/DreamInput.tsx

'use client'; // Indicates that this is a client-side component

import React, { useState } from 'react';
import { Button, Modal, Textarea, Spinner } from 'flowbite-react'; // Import UI components

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
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 flex items-center justify-center"
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
            placeholder="Describe your dream..."
            required
            value={input}
            onChange={handleInputChange}
            rows={6}
            className="w-full dream-textarea"
          />
        </Modal.Body>
        <Modal.Footer>
          {/* Submit Button */}
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Submit Dream'}
          </Button>
          {/* Cancel Button */}
          <Button color="gray" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
