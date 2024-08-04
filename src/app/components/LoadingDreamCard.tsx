import React from 'react';
import { Card, Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';

const LoadingDreamCard = () => {
  return (
    <motion.div
      initial={{ width: '100%', height: '16rem' }}
      animate={{ width: '100%', height: '16rem' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full h-full flex items-center justify-center">
        <Spinner size="xl" />
        <p className="mt-2 text-gray-500">Analyzing your dream...</p>
      </Card>
    </motion.div>
  );
};

export default LoadingDreamCard;