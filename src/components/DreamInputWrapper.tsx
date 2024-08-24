'use client';

import React from 'react';
import DreamInputForm from './DreamInputForm';
import { DreamInterpretation } from '../types/dreamAnalysis';
import { submitDream } from '../app/actions';

interface DreamInputWrapperProps {
  userId: string;
}

export default function DreamInputWrapper({ userId }: DreamInputWrapperProps) {
  const handleSubmit = async (dreamText: string): Promise<DreamInterpretation | null> => {
    return await submitDream(dreamText);
  };

  return (
    <DreamInputForm
      userId={userId}
      userFullName="User Name" // Replace with actual user name
    />
  );
}