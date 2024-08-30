import React, { useState } from 'react';
import { Button, Modal, Textarea, Spinner } from 'flowbite-react';

interface DreamInputProps {
  onSubmit: (dreamText: string) => Promise<boolean>;
  userFullName: string;
}

export default function DreamInput({ onSubmit, userFullName }: DreamInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const success = await onSubmit(input);
    setIsLoading(false);
    if (success) {
      setInput('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-14 h-14 flex items-center justify-center"
      >
        +
      </Button>

      <Modal show={isOpen} onClose={() => setIsOpen(false)} size="xl">
        <Modal.Header>Add New Dream</Modal.Header>
        <Modal.Body>
          <p className="mb-2">Adding dream for: {userFullName}</p>
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
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Submit Dream'}
          </Button>
          <Button color="gray" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}