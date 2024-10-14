import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import UserList from "./UserList";
import PokerCard from "./PokerCard";
import { Settings } from "lucide-react";
import Confetti from "react-confetti";
import ScrumPokerCard from "./ScrumPokercard";

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
  const [users, setUsers] = useState<User[]>(joinedUsers);
  const [scrumMasterId, setScrumMasterId] = useState<string>("");
  const [estimate, setEstimate] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const cardValues = ["?", "☕", "0", "0.5", "1", "2", "3", "5", "8", "13", "20", "40", "100"];

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

    socket.on("estimates-revealed", (revealed: boolean) => {
      setRevealed(revealed);
      if (revealed) {
        checkConsensus(users);
      }
    });

    socket.on("scrum-master-changed", (newScrumMasterId: string) => {
      setScrumMasterId(newScrumMasterId);
      setIsScrumMaster(newScrumMasterId === socket.id);
    });

    const checkConsensus = (users: User[]) => {
      const estimates = users.map((user) => user.estimate).filter((estimate) => estimate !== null);
      const allSame = estimates.every((estimate) => estimate === estimates[0]);
      setShowConfetti(allSame && estimates.length > 1);
    };

    return () => {
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("estimate-submitted");
      socket.off("estimates-revealed");
      socket.off("scrum-master-changed");
    };
  }, [socket, setIsScrumMaster, users]);

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
    <div className="flex justify-between gap-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-8xl">
        {showConfetti && <Confetti gravity={0.1} recycle={false} numberOfPieces={2000} />}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Scrum Poker</h2>
            <h3>Room ID: {room}</h3>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <Settings size={24} />
          </button>
        </div>
        <div className="grid grid-cols-8 gap-4 mb-8">
          {cardValues.map((value) => (
            <PokerCard key={value} value={value} selected={estimate === value} revealed={revealed} onClick={() => submitEstimate(value)} />
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          {isScrumMaster && (
            <div className="flex justify-between items-center mb-4">
              <button onClick={resetEstimates} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                Delete Estimates
              </button>
              <button onClick={toggleEstimates} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                {revealed ? "Hide" : "Reveal" } Estimates
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
      <div className="h-min min-w-80 bg-gray-100 p-4 rounded-lg">
        <UserList users={users} currentUser={socket.id as string} isScrumMaster={isScrumMaster} onChangeScrumMaster={changeScrumMaster} scrumMasterId={scrumMasterId} />
      </div>
    </div>
  );
};

export default Room;
