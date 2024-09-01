import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Badge } from 'flowbite-react';
import { DreamItem } from '@/types/dreamAnalysis';
import dayjs from 'dayjs';

interface SwipeCardsProps {
  dreams: DreamItem[];
  onDelete: (id: string) => void;
  onUpdate: (updatedDream: DreamItem) => void;
}

const SwipeCards: React.FC<SwipeCardsProps> = ({ dreams, onDelete, onUpdate }) => {
  const [cards, setCards] = useState<DreamItem[]>(dreams);

  return (
    <div
      className="grid h-[500px] w-full place-items-center bg-neutral-100"
      
    >
      {cards.map((dream, index) => (
        <Card 
          key={dream.id} 
          dream={dream} 
          cards={cards} 
          setCards={setCards} 
          index={index}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

const Card: React.FC<{
  dream: DreamItem;
  cards: DreamItem[];
  setCards: React.Dispatch<React.SetStateAction<DreamItem[]>>;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (updatedDream: DreamItem) => void;
}> = ({ dream, cards, setCards, index, onDelete, onUpdate }) => {
  const x = useMotionValue(0);
  const rotateRaw = useTransform(x, [-150, 150], [-18, 18]);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const isFront = index === cards.length - 1;
  const rotate = useTransform(() => {
    const offset = isFront ? 0 : index % 2 ? 6 : -6;
    return `${rotateRaw.get() + offset}deg`;
  });

  const handleDragEnd = () => {
    if (Math.abs(x.get()) > 100) {
      setCards((prevCards) => prevCards.filter((card) => card.id !== dream.id));
      onDelete(dream.id);
    }
  };

  const formattedDate = dream.created_at 
    ? dayjs(dream.created_at).format('MMMM D, YYYY')
    : 'Date unknown';

  return (
    <motion.div
      className="h-96 w-72 rounded-lg bg-white shadow-xl overflow-hidden"
      style={{
        gridRow: 1,
        gridColumn: 1,
        x,
        opacity,
        rotate,
        transition: "0.125s transform",
        boxShadow: isFront
          ? "0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)"
          : undefined,
      }}
      animate={{
        scale: isFront ? 1 : 0.98,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{
        left: 0,
        right: 0,
      }}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 h-full flex flex-col">
        <span className="font-normal text-sm text-yellow-600 italic">
          {formattedDate}
        </span>
        <h3 className="text-lg font-medium mb-2">{dream.title}</h3>
        <div className="mb-4 font-light flex-grow overflow-auto">
          {dream.interpretation_elements?.[0]?.content || 
           dream.verses?.[0]?.explanation || 
           dream.title || 
           'No interpretation available.'}
        </div>
        <div className="flex flex-wrap gap-2 mt-auto">
          {(dream.tags || []).concat(dream.dream_tags.map(dt => dt.tags.name)).map((tag, tagIndex) => (
            <Badge key={tagIndex} color="indigo">#{tag}</Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCards;