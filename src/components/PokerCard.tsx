import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

interface PokerCardProps {
  value: string;
  selected: boolean;
  revealed: boolean;
  onClick: () => void;
}

const PokerCard: React.FC<PokerCardProps> = ({ value, selected, onClick }) => {
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

  return (
    <motion.div
      className={`cursor-pointer border-2 rounded-lg shadow-md flex w-24 items-center justify-center aspect-[2/3] relative ${
        selected
          ? "glowing-shadow" // Apply the glowing shadow when selected
          : theme === "dark"
          ? "border-gray-600"
          : "border-gray-300"
      } ${getBackgroundColor()} ${theme === "dark" ? "text-white" : "text-gray-800"}`}
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
