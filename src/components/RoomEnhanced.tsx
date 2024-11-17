import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserList from "./UserList";
import PokerCard from "./PokerCard";
import { Sun, Moon, Users } from "lucide-react";
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
  const { theme, toggleTheme } = useTheme();
  const [users, setUsers] = useState<User[]>(joinedUsers);
  const [scrumMasterId, setScrumMasterId] = useState<string>("");
  const [estimate, setEstimate] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [maxEstimate, setMaxEstimate] = useState<string | null>(null);
  const [showUserList, setShowUserList] = useState(false);
  const cardValues = ["🤷🏻", "☕", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"];
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

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
        onClick={toggleTheme}
        className={`fixed top-4 right-4 p-3 rounded-full ${
          theme === "dark"
            ? "bg-gray-800 text-white"
            : "bg-white text-gray-800"
        } hover:bg-opacity-80 transition-colors shadow-lg`}
      >
        {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </motion.button>

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
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-500"
              >
                Room ID: {room}
              </motion.h3>
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
            className={`${
              theme === "dark" ? "bg-gray-700" : "bg-gray-100"
            } p-6 rounded-lg mb-6 shadow-inner`}
          >
            <div className="flex gap-4 justify-between items-center mb-4 h-12">
              <h3 className="text-xl font-semibold">Results</h3>
              {maxEstimate && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 items-center"
                >
                  <span>Maximum estimated number is </span>
                  <ScrumPokerCard number={maxEstimate} revealed={true} />
                </motion.div>
              )}
            </div>

            {isScrumMaster && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 justify-between items-center mb-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetEstimates}
                  className={`${
                    theme === "dark"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white px-6 py-2 rounded-lg transition-colors shadow-md flex-1`}
                >
                  Delete Estimates
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleEstimates}
                  className={`${
                    theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600"
                  } text-white px-6 py-2 rounded-lg transition-colors shadow-md flex-1`}
                >
                  {revealed ? "Hide" : "Reveal"} Estimates
                </motion.button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-2 text-left">Name</th>
                    <th className="py-2 text-right">Story Points</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="h-12"
                      >
                        <td>{user.name}</td>
                        <td className="flex justify-end mt-2 w-full">
                          {user.estimate && (
                            <ScrumPokerCard
                              number={user.estimate}
                              revealed={revealed}
                            />
                          )}
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
              } p-6 rounded-lg shadow-lg md:shadow-none z-50`}
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
