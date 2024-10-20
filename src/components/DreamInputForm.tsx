// src/components/DreamInputForm.tsx

'use client'; // Indicates that this is a client-side component

import React, { useState } from 'react';
import { Button, Spinner } from 'flowbite-react'; // Import UI components
import { useRouter } from 'next/navigation'; // Import router for navigation actions
import { DreamItem } from '@/types/dreamAnalysis'; // Import from dreamAnalysis.ts

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
  const router = useRouter(); // Router for navigation or refreshing the page

  // Function to handle changes in the dream input field
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Function to handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior
    setIsLoading(true); // Set loading state to true
    const success = await onSubmit(input); // Call the onSubmit function passed from props
    setIsLoading(false); // Set loading state to false
    if (success) {
      setInput(''); // Clear the input field
      router.refresh(); // Refresh the page or perform additional actions
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex items-center justify-center">
        <div className="center-box mr-4">
          {/* Textarea for entering the dream */}
          <textarea
            id="dream"
            placeholder="Enter your dream"
            required
            value={input}
            onChange={handleInputChange}
            className="cloud-textarea focus:outline-none focus:ring-0 animate-fade-right animate-once animate-duration-[800ms] animate-ease-out"
          />
        </div>
        {/* Submit Button */}
        <Button
          type="submit"
          size="sm"
          color="blue"
          disabled={isLoading}
          className="cloud-button animate-fade-left animate-once animate-duration-[800ms] animate-ease-out"
        >
          {isLoading ? <Spinner size="sm" /> : 'Add Dream'}
        </Button>
      </div>
    </form>
  );
}
