import React from 'react';
import { motion } from 'framer-motion';
import OpenAIAnalysisCard from './OpenAIAnalysisCard';
import { DreamAnalysis } from '../types/dreamAnalysis';

interface AnimatedDreamCardProps {
  dream: DreamAnalysis;
  onDelete: () => void;
  onUpdate: () => void;
}

const AnimatedDreamCard: React.FC<AnimatedDreamCardProps> = ({ dream, onDelete, onUpdate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <OpenAIAnalysisCard dream={dream} onDelete={onDelete} onUpdate={onUpdate}/>
    </motion.div>
  );
};

export default AnimatedDreamCard;