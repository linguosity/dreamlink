import { motion, MotionProps, MotionStyle } from 'framer-motion';
import type { ComponentProps } from 'react';

type MotionDivProps = MotionProps & ComponentProps<'div'> & {
  style?: MotionStyle;
};

export const MotionDiv = motion.div as React.FC<MotionDivProps>;