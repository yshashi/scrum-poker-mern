import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { motion } from 'framer-motion';
import UserList from './UserList';
import PokerCard from './PokerCard';

interface RoomProps {
  socket: Socket;
  room: string;
  username: string;
  isScrumMaster: boolean;
  setIsScrumMaster: (value: boolean) => void;
}

interface User {
  id: string;
  name: string;
  estimate: string | null;
}

const Room: React.FC<RoomProps> = ({ socket, room, username, isScrumMaster, setIsScrumMaster }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [estimate, setEstimate] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const cardValues = ['1', '2', '3', '5', '8', '13', '21', '?'];

  useEffect(() => {
    socket.on('user-joined', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on('user-left', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on('estimate-submitted', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    socket.on('estimates-revealed', (revealed: boolean) => {
      setRevealed(revealed);
    });

    socket.on('scrum-master-changed', (newScrumMasterId: string) => {
      setIsScrumMaster(newScrumMasterId === socket.id);
    });

    return () => {
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('estimate-submitted');
      socket.off('estimates-revealed');
      socket.off('scrum-master-changed');
    };
  }, [socket, setIsScrumMaster]);

  const submitEstimate = (value: string) => {
    setEstimate(value);
    socket.emit('submit-estimate', room, value);
  };

  const revealEstimates = () => {
    socket.emit('reveal-estimates', room);
  };

  const resetEstimates = () => {
    socket.emit('reset-estimates', room);
    setEstimate(null);
    setRevealed(false);
  };

  const changeScrumMaster = (userId: string) => {
    socket.emit('change-scrum-master', room, userId);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Room: {room}</h2>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <UserList
            users={users}
            currentUser={socket.id}
            isScrumMaster={isScrumMaster}
            onChangeScrumMaster={changeScrumMaster}
          />
        </div>
        <div className="w-full md:w-2/3 px-2">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {cardValues.map((value) => (
              <PokerCard
                key={value}
                value={value}
                selected={estimate === value}
                revealed={revealed}
                onClick={() => submitEstimate(value)}
              />
            ))}
          </div>
          {isScrumMaster && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={revealEstimates}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                disabled={revealed}
              >
                Reveal Estimates
              </button>
              <button
                onClick={resetEstimates}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;