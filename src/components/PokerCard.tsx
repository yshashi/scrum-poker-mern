import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

interface PokerCardProps {
  value: string;
  selected: boolean;
  revealed: boolean;
  onClick: () => void;
}

const PokerCard: React.FC<PokerCardProps> = ({ value, selected, revealed, onClick }) => {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    if (theme === "dark") {
      if (value === "🤷🏻") return "bg-gray-700";
      if (value === "☕") return "bg-yellow-900";
      return "bg-gray-800";
    } else {
      if (value === "🤷🏻") return "bg-gray-200";
      if (value === "☕") return "bg-yellow-100";
      return "bg-white";
    }
  };

  const cardVariants = {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      y: 0
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: { 
      scale: 1.05,
      y: -5,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { 
      scale: 0.95,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    selected: {
      scale: 1.05,
      y: -10,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate={selected ? "selected" : "animate"}
      whileTap={!revealed && !selected ? "tap" : undefined}
      onClick={() => !revealed && onClick()}
      className={`
        relative w-full aspect-[2/3] rounded-xl overflow-hidden
        ${revealed ? 'cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-300
        ${selected 
          ? `ring-4 ${theme === "dark" ? "ring-blue-500" : "ring-blue-400"} shadow-xl` 
          : `ring-1 ${theme === "dark" ? "ring-gray-600/50" : "ring-gray-300/50"}`
        }
        ${getBackgroundColor()}
        ${theme === "dark" ? "text-white" : "text-gray-800"}
        ${revealed ? 'opacity-50' : ''}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br to-transparent from-white/10" />
      
      <div className="flex relative justify-center items-center p-2 w-full h-full">
        <motion.img 
          src="/sp.png" 
          className="absolute top-2 left-2 w-8 h-8 opacity-50"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />
        <motion.img 
          src="/sp.png"
          className="absolute right-2 bottom-2 w-8 h-8 opacity-50" 
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        />
        <motion.span 
          className="text-2xl font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          {value}
        </motion.span>
      </div>
      
      {selected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-t to-transparent from-blue-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default PokerCard;
