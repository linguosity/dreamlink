import React from 'react';
import { TextInput, Button, Spinner } from 'flowbite-react';

interface DreamInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function DreamInput({ input, handleInputChange, handleSubmit, isLoading }: DreamInputProps) {
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center">
        <TextInput
          id="dream"
          type="text"
          placeholder="Enter your dream"
          required
          value={input}
          onChange={handleInputChange}
          className="flex-grow"
        />
        <Button type="submit" className="ml-2">
          {isLoading ? <Spinner size="sm" /> : 'Analyze Dream'}
        </Button>
      </div>
    </form>
  );
}