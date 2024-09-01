import React, { useState, useEffect } from 'react';
import { motion, useAnimation, PanInfo } from "framer-motion";
import { Badge } from 'flowbite-react';
import { DreamItem } from '@/types/dreamAnalysis';
import dayjs from 'dayjs';

interface InfiniteSwipeableCardsProps {
  dreams: DreamItem[];
  onUpdate: (updatedDream: DreamItem) => void;
  onDelete: (dreamId: string) => void;
}

const InfiniteSwipeableCards: React.FC<InfiniteSwipeableCardsProps> = ({ dreams, onUpdate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const controls = useAnimation();

  const wraparoundIndex = (index: number) => {
    return (index + dreams.length) % dreams.length;
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setDirection('left');
    } else if (info.offset.x > swipeThreshold) {
      setDirection('right');
    }
  };

  useEffect(() => {
    if (direction) {
      controls.start({ x: direction === 'left' ? -300 : 300, opacity: 0 })
        .then(() => {
          setCurrentIndex(prevIndex => 
            direction === 'left' ? wraparoundIndex(prevIndex + 1) : wraparoundIndex(prevIndex - 1)
          );
          setDirection(null);
          controls.set({ x: 0, opacity: 1 });
        });
    }
  }, [direction, controls]);

  if (dreams.length === 0) {
    return <p>No dreams found. Start by adding a new dream!</p>;
  }

  const currentDream = dreams[currentIndex];
  const formattedDate = currentDream.created_at 
    ? dayjs(currentDream.created_at).format('MMMM D, YYYY')
    : 'Date unknown';

  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-neutral-100">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-72 h-96">
          <span className="font-normal text-sm text-yellow-600 italic dark:text-gray-400">
            {formattedDate}
          </span>
          <h3 className="text-lg font-medium mb-2">{currentDream.title}</h3>
          <div className="mb-4 font-light">
            {currentDream.interpretation_elements?.[0]?.content || 
             currentDream.verses?.[0]?.explanation || 
             currentDream.title || 
             'No interpretation available.'}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {(currentDream.tags || []).concat(currentDream.dream_tags.map(dt => dt.tags.name)).map((tag, index) => (
              <Badge key={index} color="indigo">#{tag}</Badge>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <p className="text-sm text-gray-500">
          Swipe left or right to view more dreams
        </p>
      </div>
    </div>
  );
};

export default InfiniteSwipeableCards;