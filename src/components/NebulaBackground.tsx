'use client';

import Image from 'next/image';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useState } from 'react';
import { MotionDiv } from '@/lib/motion';

export default function NebulaBackground() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black z-[-2]" />
      <MotionDiv
        className="fixed inset-0 z-[-1] overflow-hidden"
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ 
          opacity: isLoaded ? 0.4 : 0,
          backdropFilter: isLoaded ? 'blur(8px)' : 'blur(0px)',
        }}
        transition={{
          opacity: { duration: 2 },
          backdropFilter: { duration: 0.5 },
          rotate: { 
            duration: 500,
            repeat: Infinity,
            ease: "linear"
          }
        }}
      >
        {/* Add a slightly larger container to prevent black edges */}
        <div className="absolute inset-[-10%] scale-125">
          <Image
            src="/images/nebula.png"
            alt="Nebula background"
            fill
            quality={100}
            priority
            className="object-cover"
            onLoad={() => setIsLoaded(true)}
            sizes="100vw"
          />
        </div>
      </MotionDiv>
    </>
  );
}
