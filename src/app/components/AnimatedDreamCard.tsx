import React from 'react';
import { motion } from 'framer-motion';
import OpenAIAnalysisCard from './OpenAIAnalysisCard';
import { DreamAnalysis } from '../types/dreamAnalysis';

interface AnimatedDreamCardProps {
  dream: DreamAnalysis;
}

const AnimatedDreamCard: React.FC<AnimatedDreamCardProps> = ({ dream }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <OpenAIAnalysisCard dream={dream} />
    </motion.div>
  );
};

export default AnimatedDreamCard;