import React from 'react';
import { motion } from 'framer-motion';

interface PokerCardProps {
  value: string;
  selected: boolean;
  revealed: boolean;
  onClick: () => void;
}

const PokerCard: React.FC<PokerCardProps> = ({ value, selected, revealed, onClick }) => {
  return (
    <motion.div
      className={`cursor-pointer bg-white border-2 rounded-lg shadow-md flex items-center justify-center h-24 ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <motion.div
        className="w-full h-full flex items-center justify-center"
        initial={false}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {revealed ? (
          <motion.span
            className="text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {value}
          </motion.span>
        ) : (
          <motion.div
            className="w-12 h-12 bg-blue-500 rounded-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: revealed ? 0 : 1 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default PokerCard;