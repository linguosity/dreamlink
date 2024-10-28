import { motion, HTMLMotionProps } from 'framer-motion';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// Create a comprehensive type that includes both HTML div props and motion props
export type MotionDivProps = HTMLMotionProps<"div"> & 
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

// Create a properly typed component that explicitly includes HTML attributes
export const MotionDiv = motion.div as React.ComponentType<MotionDivProps>;
