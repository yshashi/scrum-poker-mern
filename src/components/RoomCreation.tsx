import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, ArrowRight, ArrowLeft, UserPlus, Users2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface RoomCreationProps {
  createRoom: (name: string) => void;
  joinRoom: (roomId: string, name: string) => void;
  room: string | null;
}

const InputField: React.FC<{
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  required?: boolean;
}> = ({ placeholder, value, onChange, icon, required }) => {
  const { theme } = useTheme();
  
  return (
    <div className="relative mb-6">
      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {icon}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`
          w-full pl-12 pr-4 py-3 rounded-xl
          ${theme === 'dark'
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
          }
          border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200
          backdrop-blur-sm
        `}
      />
    </div>
  );
};

const RoomCreation: React.FC<RoomCreationProps> = ({ createRoom, joinRoom, room }) => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { roomId: urlRoomId } = useParams<{ roomId?: string }>();
  const { theme } = useTheme();

  useEffect(() => {
    if (urlRoomId) {
      setRoomId(urlRoomId);
      setIsJoining(true);
    }
  }, [urlRoomId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isJoining) {
      joinRoom(roomId, name);
      navigate(`/room/${roomId}`);
    } else {
      createRoom(name);
      navigate(`/room/${room}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`
      min-h-screen flex items-center justify-center p-4
      ${theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500'
      }
    `}>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className={`
          w-full max-w-md p-8 rounded-2xl
          ${theme === 'dark'
            ? 'bg-gray-800/80 text-white'
            : 'bg-white/90 text-gray-900'
          }
          backdrop-blur-lg shadow-2xl
          relative overflow-hidden
        `}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 backdrop-blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full -ml-12 -mb-12 backdrop-blur-xl"></div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-8"
        >
          <div className={`
            p-4 rounded-2xl
            ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'}
            backdrop-blur-sm
          `}>
            <Users className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-center mb-8"
        >
          {isJoining ? 'Join Room' : 'Create Room'}
        </motion.h1>

        <AnimatePresence mode="wait">
          <motion.form
            key={isJoining ? 'join' : 'create'}
            initial={{ x: isJoining ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isJoining ? -100 : 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
          >
            <InputField
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<Users2 className="w-5 h-5" />}
              required
            />
            
            {isJoining && (
              <InputField
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                icon={<UserPlus className="w-5 h-5" />}
                required
              />
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className={`
                w-full py-3 px-6 rounded-xl
                flex items-center justify-center
                ${theme === 'dark'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
                }
                text-white font-semibold
                transition-colors duration-200
                shadow-lg hover:shadow-xl
              `}
            >
              {isJoining ? 'Join Room' : 'Create Room'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setIsJoining(!isJoining)}
              className={`
                w-full mt-4 py-2 px-4
                flex items-center justify-center
                ${theme === 'dark'
                  ? 'text-gray-300 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }
                font-medium transition-colors duration-200
              `}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isJoining ? 'Create a new room instead' : 'Join an existing room'}
            </motion.button>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RoomCreation;