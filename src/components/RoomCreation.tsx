import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users } from 'lucide-react';

interface RoomCreationProps {
  createRoom: (name: string) => void;
  joinRoom: (roomId: string, name: string) => void;
  room: string | null;
}

const RoomCreation: React.FC<RoomCreationProps> = ({ createRoom, joinRoom, room }) => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { roomId: urlRoomId } = useParams<{ roomId?: string }>();

  React.useEffect(() => {
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

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      {/* Background card effect */}
      <div className="absolute bg-blue-500 h-80 w-96 transform rotate-6 rounded-xl shadow-lg"></div>
      <div className="absolute bg-blue-400 h-80 w-96 transform rotate-3 rounded-xl shadow-lg"></div>
      
      {/* Main card */}
      <div className="bg-white p-8 rounded-lg shadow-md w-96 relative z-10">
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
    </div>
  );
};

export default RoomCreation;