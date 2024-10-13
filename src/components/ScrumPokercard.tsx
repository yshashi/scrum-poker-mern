import { motion } from 'framer-motion';

interface ScrumPokerCardProps {
  number: string;
  revealed: boolean;
}

const ScrumPokerCard: React.FC<ScrumPokerCardProps> = ({ number, revealed }) => {
  return (
    <motion.div
      className={`relative w-8 h-8 p-4 bg-white shadow-lg rounded-lg cursor-pointer ${
        revealed ? '' : 'bg-gray-200'
      }`}
      animate={{ rotateY: revealed ? 0 : 180 }}
      transition={{ duration: 0.8 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0 flex justify-center items-center"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {revealed ? (
          <div className="text-base">{number}</div>
        ) : (
          <div className="text-xl text-gray-500"><span className="text-xl"><img className="w-8 h-8" src="/sp.png" /></span></div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ScrumPokerCard;