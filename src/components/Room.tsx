import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserList from "./UserList";
import PokerCard from "./PokerCard";
import { Users, Share2, Check } from "lucide-react";
import Confetti from "react-confetti";
import { useTheme } from "../contexts/ThemeContext";
import ScrumPokerCard from "./ScrumPokercard";
import { getMostFrequentEstimate } from "../libs/maxEstimate";

interface RoomProps {
  socket: Socket;
  room: string;
  username: string;
  isScrumMaster: boolean;
  joinedUsers: User[];
  setIsScrumMaster: (value: boolean) => void;
}

export interface User {
  id: string;
  name: string;
  estimate: string | null;
}

const Room: React.FC<RoomProps> = ({
  socket,
  room,
  isScrumMaster,
  setIsScrumMaster,
  joinedUsers,
}) => {
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>(joinedUsers);
  const [scrumMasterId, setScrumMasterId] = useState<string>("");
  const [estimate, setEstimate] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [maxEstimate, setMaxEstimate] = useState<string | null>(null);
  const [showUserList, setShowUserList] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardValues = ["🤷🏻", "☕", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"];
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const copyRoomLink = async () => {
    const url = `${window.location.origin}/room/${room}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (room !== roomId) {
      navigate(`/room/${room}`);
    }
  }, [room, roomId, navigate]);

  useEffect(() => {
    socket.on("user-joined", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on("user-left", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on("estimate-submitted", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    const checkConsensus = (users: User[]) => {
      const estimates = users
        .map((user) => user.estimate && user.id !== scrumMasterId)
        .filter((estimate) => estimate !== null);
      const allSame = estimates.every((estimate) => estimate === estimates[0]);
      setShowConfetti(allSame && estimates.length > 1);
    };

    socket.on("estimates-revealed", (revealed: boolean) => {
      setRevealed(revealed);
      if (revealed) {
        checkConsensus(users);
        setMaxEstimate(getMostFrequentEstimate(users));
      } else {
        setMaxEstimate(null);
      }
    });

    socket.on("scrum-master-changed", (newScrumMasterId: string) => {
      setScrumMasterId(newScrumMasterId);
      setIsScrumMaster(newScrumMasterId === socket.id);
    });

    return () => {
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("estimate-submitted");
      socket.off("estimates-revealed");
      socket.off("scrum-master-changed");
    };
  }, [socket, setIsScrumMaster, users, scrumMasterId]);

  const submitEstimate = (value: string) => {
    if (!revealed) {
      setEstimate(value);
      socket.emit("submit-estimate", room, value);
    }
  };

  const revealEstimates = () => {
    socket.emit("reveal-estimates", room);
    setRevealed(true);
  };

  const hideEstimates = () => {
    socket.emit("hide-estimates", room);
    setRevealed(false);
  };

  const toggleEstimates = () => {
    if (revealed) {
      hideEstimates();
    } else {
      revealEstimates();
    }
  };

  const resetEstimates = () => {
    socket.emit("reset-estimates", room);
    setEstimate(null);
    setRevealed(false);
    setShowConfetti(false);
  };

  const changeScrumMaster = (userId: string) => {
    socket.emit("change-scrum-master", room, userId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex justify-between gap-4 p-4 min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowUserList(!showUserList)}
        className={`fixed top-4 right-20 p-3 rounded-full ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-white text-gray-800"
        } hover:bg-opacity-80 transition-colors shadow-lg md:hidden`}
      >
        <Users className="w-6 h-6" />
      </motion.button>

      <div className="container flex gap-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } p-8 rounded-lg shadow-lg flex-1`}
        >
          {showConfetti && (
            <Confetti gravity={0.1} recycle={false} numberOfPieces={2000} />
          )}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                Scrum Poker
              </h2>
              <div className="flex gap-2 items-center mt-1">
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-500"
                >
                  Room ID: {room}
                </motion.h3>
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyRoomLink}
                  className={`
                    p-1.5 rounded-lg transition-colors
                    ${theme === "dark" 
                      ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" 
                      : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"}
                  `}
                  title="Copy room link"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
          >
            <AnimatePresence>
              {cardValues.map((value, index) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PokerCard
                    value={value}
                    selected={estimate === value}
                    revealed={revealed}
                    onClick={() => submitEstimate(value)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`
              ${theme === "dark" ? "bg-gray-700/50" : "bg-gray-100/50"}
              p-6 rounded-xl mb-6 shadow-inner backdrop-blur-sm
              border border-gray-200/10
            `}
          >
            <div className="flex flex-col gap-4 justify-between items-start mb-6 sm:flex-row sm:items-center">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex gap-3 items-center"
              >
                <h3 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                  Results
                </h3>
                {revealed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`
                      px-2.5 py-0.5 rounded-full text-sm font-medium mt-1 ml-4
                      ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}
                    `}
                  >
                    Revealed
                  </motion.div>
                )}
              </motion.div>

              {maxEstimate && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3 items-center px-4 py-2 bg-gradient-to-r rounded-lg from-blue-500/10 to-purple-500/10"
                >
                  <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                    Team's consensus
                  </span>
                  <ScrumPokerCard number={maxEstimate} revealed={true} />
                </motion.div>
              )}
            </div>

            {isScrumMaster && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-4 justify-between items-stretch mb-6 sm:flex-row"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetEstimates}
                  className={`
                    ${theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"}
                    text-white px-6 py-3 rounded-lg transition-colors shadow-md flex-1 font-semibold
                  `}
                >
                  Delete Estimates
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleEstimates}
                  className={`
                    ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}
                    text-white px-6 py-3 rounded-lg transition-colors shadow-md flex-1 font-semibold
                  `}
                >
                  {revealed ? "Hide" : "Reveal"} Estimates
                </motion.button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="overflow-hidden rounded-lg"
            >
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left border-b border-gray-200/10">
                      <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                        Name
                      </span>
                    </th>
                    <th className="px-4 py-3 text-right border-b border-gray-200/10">
                      <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
                        Story Points
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {users
                      .filter(user => user.id !== scrumMasterId) // Exclude Scrum Master
                      .map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          delay: index * 0.1
                        }}
                        className={`
                          ${index % 2 === 0 
                            ? theme === "dark" ? "bg-gray-800/30" : "bg-gray-50/50"
                            : ""
                          }
                          transition-colors hover:bg-gray-500/10
                        `}
                      >
                        <td className="px-4 py-3">
                          <div className="flex gap-2 items-center">
                            <span className="font-medium">{user.name}</span>
                            {user.id === socket.id && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-end items-center">
                            {user.estimate ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 30
                                }}
                              >
                                <ScrumPokerCard number={user.estimate} revealed={revealed} />
                              </motion.div>
                            ) : (
                              <span className="text-sm italic text-gray-400">
                                {revealed ? "No estimate" : "Thinking..."}
                              </span>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {(showUserList || window.innerWidth >= 768) && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className={`fixed md:relative right-0 top-0 h-full md:h-min md:min-w-80 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-6 rounded-lg shadow-lg md:shadow-none z-30`}
            >
              <UserList
                users={users}
                currentUser={socket.id as string}
                isScrumMaster={isScrumMaster}
                onChangeScrumMaster={changeScrumMaster}
                scrumMasterId={scrumMasterId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Room;
