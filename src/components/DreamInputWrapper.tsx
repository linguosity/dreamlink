'use client';

import React from 'react';
import DreamInputForm from './DreamInputForm';
import { DreamItem, DreamInterpretation } from '../types/dreamAnalysis';
import { submitDream } from '../app/actions';

interface DreamInputWrapperProps {
  userId: string;
  onAddDream: (dream: DreamItem) => void;
}

export default function DreamInputWrapper({ userId, onAddDream }: DreamInputWrapperProps) {
  const handleSubmit = async (dreamText: string): Promise<DreamInterpretation | null> => {
    return await submitDream(dreamText);
  };

  return (
    <DreamInputForm
      userId={userId}
      userFullName="User Name" // Replace with actual user name
      onAddDream={onAddDream}
    />
  );
}