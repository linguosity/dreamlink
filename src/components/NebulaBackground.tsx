'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function NebulaBackground() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black z-[-2]" />
      <motion.div
        className="fixed inset-0 z-[-1] overflow-hidden backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isLoaded ? 0.4 : 0,
          rotate: 360 
        }}
        transition={{
          opacity: { duration: 2 },
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
      </motion.div>
    </>
  );
}
