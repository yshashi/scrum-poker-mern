import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface RoomCreationProps {
  createRoom: (name: string) => void;
  joinRoom: (roomId: string, name: string) => void;
  room: string | null
}

const RoomCreation: React.FC<RoomCreationProps> = ({ createRoom, joinRoom, room }) => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const { roomId: urlRoomId } = useParams<{ roomId?: string }>();
  const { theme, toggleTheme } = useTheme();

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
      navigate(`/room/${room}`)
      // The navigation to the room will be handled in the App component after room creation
    }
  };

  return (
    <div className={`relative flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} hover:bg-opacity-80 transition-colors`}
      >
        {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
      
      {/* Background card effect */}
      <div className={`absolute ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500'} h-80 w-96 transform rotate-6 rounded-xl shadow-lg`}></div>
      <div className={`absolute ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'} h-80 w-96 transform rotate-3 rounded-xl shadow-lg`}></div>
      
      {/* Main card */}
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-8 rounded-lg shadow-md w-96 relative z-10`}>
        <div className="flex items-center justify-center mb-6">
          <Users className={`w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} mr-2`} />
          <h1 className="text-2xl font-bold">Scrum Poker</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 mb-4 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
            required
          />
          {isJoining && (
            <input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className={`w-full p-2 mb-4 border rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
              required
            />
          )}
          <button
            type="submit"
            className={`w-full ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white p-2 rounded transition-colors`}
          >
            {isJoining ? 'Join Room' : 'Create Room'}
          </button>
        </form>
        <button
          onClick={() => setIsJoining(!isJoining)}
          className={`w-full mt-4 ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'} transition-colors`}
        >
          {isJoining ? 'Create a new room instead' : 'Join an existing room'}
        </button>
      </div>
    </div>
  );
};

export default RoomCreation;