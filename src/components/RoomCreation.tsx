import React, { useState } from 'react';
import { Users } from 'lucide-react';

interface RoomCreationProps {
  createRoom: (name: string) => void;
  joinRoom: (roomId: string, name: string) => void;
}

const RoomCreation: React.FC<RoomCreationProps> = ({ createRoom, joinRoom }) => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isJoining) {
      joinRoom(roomId, name);
    } else {
      createRoom(name);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-96">
      <div className="flex items-center justify-center mb-6">
        <Users className="w-12 h-12 text-blue-500 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Scrum Poker</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />
        {isJoining && (
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          {isJoining ? 'Join Room' : 'Create Room'}
        </button>
      </form>
      <button
        onClick={() => setIsJoining(!isJoining)}
        className="w-full mt-4 text-blue-500 hover:text-blue-600 transition-colors"
      >
        {isJoining ? 'Create a new room instead' : 'Join an existing room'}
      </button>
    </div>
  );
};

export default RoomCreation;