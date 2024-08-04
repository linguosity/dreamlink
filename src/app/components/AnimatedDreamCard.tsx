import React from 'react';
import { motion } from 'framer-motion';
import DreamAnalysisCard from './OpenAIAnalysisCard';

interface Verse {
  reference: string;
  text: string;
}

interface DreamAnalysis {
  title: string;
  interpretation: string;
  tags: string[];
  verses: Verse[];
  originalDream: string;
}

interface AnimatedDreamCardProps {
  dream: DreamAnalysis;
}

const AnimatedDreamCard: React.FC<AnimatedDreamCardProps> = ({ dream }) => {
  return (
    <motion.div
      initial={{ width: '100%', height: '16rem', opacity: 0 }}
      animate={{ width: '100%', height: 'auto', opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DreamAnalysisCard dream={dream} />
    </motion.div>
  );
};

export default AnimatedDreamCard;