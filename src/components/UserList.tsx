import React from "react";
import { User, Crown, CheckCircle2, UserCog } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

interface UserListProps {
  users: { id: string; name: string; estimate: string | null }[];
  currentUser: string;
  isScrumMaster: boolean;
  scrumMasterId: string | null;
  onChangeScrumMaster: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, currentUser, isScrumMaster, onChangeScrumMaster, scrumMasterId }) => {
  const { theme } = useTheme();

  return (
    <>
      <div className="flex gap-3 items-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <UserCog className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
        </motion.div>
        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          Participants
        </h3>
      </div>
      
      <motion.ul className="space-y-3">
        <AnimatePresence mode="popLayout">
          {users.map((user, index) => (
            <motion.li
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: index * 0.1
              }}
              className={`
                flex items-center justify-between p-3 rounded-lg
                ${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50/50'}
                transition-colors duration-200
              `}
            >
              <div className="flex gap-3 items-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {scrumMasterId === user.id ? (
                    <Crown className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`} />
                  ) : (
                    <User className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </motion.div>
                
                <div className="flex gap-2 items-center">
                  <span className="font-medium">
                    {user.name}
                    {user.id === currentUser && (
                      <span className="ml-2 text-sm text-gray-400">(You)</span>
                    )}
                  </span>
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {scrumMasterId === user.id ? (
                      <span className={`
                        inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium
                        ${theme === 'dark' ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-50 text-yellow-700'}
                        ring-1 ring-inset ring-yellow-600/20
                      `}>
                        <Crown className="w-3 h-3" />
                        Scrum Master
                      </span>
                    ) : (
                      <span className={`
                        inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium
                        ${theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-50 text-purple-700'}
                        ring-1 ring-inset ring-purple-700/10
                      `}>
                        <User className="w-3 h-3" />
                        Dev
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>

              <div className="flex gap-3 items-center">
                {user.estimate && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
                
                {isScrumMaster && user.id !== currentUser && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onChangeScrumMaster(user.id)}
                    className={`
                      ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}
                      transition-colors duration-200
                    `}
                    title="Make Scrum Master"
                  >
                    <Crown className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
};

export default UserList;