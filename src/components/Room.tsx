import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import UserList from "./UserList";
import PokerCard from "./PokerCard";
import { Settings, Sun, Moon } from "lucide-react";
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

const Room: React.FC<RoomProps> = ({ socket, room, isScrumMaster, setIsScrumMaster, joinedUsers }) => {
  const { theme, toggleTheme } = useTheme();
  const [users, setUsers] = useState<User[]>(joinedUsers);
  const [scrumMasterId, setScrumMasterId] = useState<string>("");
  const [estimate, setEstimate] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [maxEstimate, setMaxEstimate] = useState<string | null>(null);
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
      const estimates = users.map((user) => user.estimate && user.id !== scrumMasterId).filter((estimate) => estimate !== null);
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
    setEstimate(value);
    socket.emit("submit-estimate", room, value);
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
    <div className={`flex justify-between gap-4 p-4 min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-full ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"} hover:bg-opacity-80 transition-colors`}
      >
        {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
      <div className="flex gap-8 container">
        <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} p-8 rounded-lg shadow-md max-w-8xl`}>
          {showConfetti && <Confetti gravity={0.1} recycle={false} numberOfPieces={2000} />}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Scrum Poker</h2>
              <h3>Room ID: {room}</h3>
            </div>
            <button className={`${theme === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}>
              <Settings size={24} />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-4 mb-8">
            {cardValues.map((value) => (
              <PokerCard key={value} value={value} selected={estimate === value} revealed={revealed} onClick={() => submitEstimate(value)} />
            ))}
          </div>
          <div className={`${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} p-4 rounded-lg mb-6`}>
            <div className="flex justify-between gap-4 mb-4 h-12 items-center">
              <h3 className="text-xl font-semibold">Results</h3>
              {maxEstimate && <div className="flex gap-2 items-center"><span>Maximum estimated number is </span><ScrumPokerCard number={maxEstimate} revealed={true} /></div>}
            </div>
            {isScrumMaster && (
              <div className="flex justify-between items-center mb-4">
                <button onClick={resetEstimates} className={`${theme === "dark" ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"} text-white px-4 py-2 rounded transition-colors`}>
                  Delete Estimates
                </button>
                <button onClick={toggleEstimates} className={`${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white px-4 py-2 rounded transition-colors`}>
                  {revealed ? "Hide" : "Reveal"} Estimates
                </button>
              </div>
            )}
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Name</th>
                  <th className="text-right">Story Points</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr className="h-12" key={user.id}>
                    <td>{user.name}</td>
                    <td className="flex justify-end w-full mt-2">{user.estimate && <ScrumPokerCard number={user.estimate} revealed={revealed} />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={`h-min min-w-80 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} p-4 rounded-lg`}>
          <UserList users={users} currentUser={socket.id as string} isScrumMaster={isScrumMaster} onChangeScrumMaster={changeScrumMaster} scrumMasterId={scrumMasterId} />
        </div>
      </div>
    </div>
  );
};

export default Room;
