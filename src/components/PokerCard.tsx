import React from 'react';
import { motion } from 'framer-motion';

interface PokerCardProps {
  value: string;
  selected: boolean;
  revealed: boolean;
  onClick: () => void;
}

const PokerCard: React.FC<PokerCardProps> = ({ value, selected, onClick }) => {
  const getBackgroundColor = () => {
    if (value === '?') return 'bg-gray-200';
    if (value === '☕') return 'bg-yellow-100';
    return 'bg-white';
  };

  return (
    <motion.div
      className={`cursor-pointer border-2 rounded-lg shadow-md flex w-24 items-center justify-center aspect-[2/3] ${
        selected ? 'border-blue-500' : 'border-gray-300'
      } ${getBackgroundColor()}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <img src="/sp.png" className="absolute top-2 left-2 w-8 h-8" />
        <img className="absolute bottom-2 right-2 w-8 h-8" src="/sp.png" />
        <span className="text-xl">{value}</span>
      </div>
    </motion.div>
  );
};

export default PokerCard;