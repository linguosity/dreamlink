import { HTMLMotionProps } from 'framer-motion';
import { MotionDiv } from '@/lib/motion';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export const NotificationToast = ({ message, type }: NotificationToastProps) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: -100, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
      } text-white`}
    >
      {message}
    </MotionDiv>
  );
};
