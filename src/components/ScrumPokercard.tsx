import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface ScrumPokerCardProps {
  number: string;
  revealed: boolean;
}

const ScrumPokerCard: React.FC<ScrumPokerCardProps> = ({ number, revealed }) => {
  const { theme } = useTheme(); // Added to handle dark/light theme

  // Function to get background color based on the theme
  const getBackgroundColor = () => {
    if (theme === 'dark') {
      return revealed ? 'bg-gray-800 shadow-slate-400' : 'bg-gray-700 shadow-slate-400';
    } else {
      return revealed ? 'bg-white' : 'bg-white';
    }
  };

  // Function to get text color based on the theme
  const getTextColor = () => {
    if (theme === 'dark') {
      return revealed ? 'text-white' : 'text-gray-400';
    } else {
      return revealed ? 'text-gray-800' : 'text-gray-500';
    }
  };

  return (
    <motion.div
      className={`relative w-8 h-8 p-4 shadow rounded-lg cursor-pointer ${getBackgroundColor()}`}
      animate={{ rotateY: revealed ? 0 : 180 }}
      transition={{ duration: 0.8 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="absolute inset-0 flex justify-center items-center"
        style={{ backfaceVisibility: 'hidden' }}
      >
        {revealed ? (
          // Using the theme-based text color
          <div className={`text-base ${getTextColor()}`}>{number}</div>
        ) : (
          // Adjusted the image section and text to use theme-based styles
          <div className={`text-xl ${getTextColor()}`}>
            <span className="text-xl">
              <img className="w-8 h-8" src="/sp.png" />
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ScrumPokerCard;
