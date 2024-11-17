import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import LandingPage from './components/LandingPage';
import RoomCreation from './components/RoomCreation';
import Room, { User } from './components/Room';
import Changelog from './components/Changelog';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Moon, Sun, History } from "lucide-react";
import { motion } from "framer-motion";

const AppContent: React.FC = () => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [room, setRoom] = React.useState<string | null>(null);
  const [username, setUsername] = React.useState<string>('');
  const [isScrumMaster, setIsScrumMaster] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<User[]>([]);
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    const newSocket = io('https://poker.letsprogram.in');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createRoom = (name: string) => {
    if (socket) {
      socket.emit('create-room', name, (roomId: string, users: User[]) => {
        setRoom(roomId);
        setUsername(name);
        setIsScrumMaster(true);
        setUsers(users);
      });
    }
  };

  const joinRoom = (roomId: string, name: string) => {
    if (socket) {
      socket.emit('join-room', roomId, name, (success: boolean, users: User[]) => {
        if (success) {
          setRoom(roomId);
          setUsername(name);
          setUsers(users);
        } else {
          alert('Failed to join room. Please check the room ID and try again.');
        }
      });
    }
  };

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <nav className="flex fixed top-4 right-4 z-50 gap-4 items-center">
        <Link
          to="/changelog"
          className={`
            p-2 rounded-lg transition-all duration-200
            ${theme === "dark" 
              ? "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50" 
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-200/50"
            }
          `}
          title="View Changelog"
        >
          <History className="w-5 h-5" />
        </Link>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className={`
            p-2 rounded-lg transition-colors duration-200
            ${theme === "dark"
              ? "bg-gray-800/50 text-gray-400 hover:text-yellow-300"
              : "bg-white/50 text-gray-600 hover:text-blue-500"
            }
            backdrop-blur-sm shadow-lg
          `}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/create"
          element={<RoomCreation createRoom={createRoom} joinRoom={joinRoom} room={room} />}
        />
        <Route
          path="/room/:roomId"
          element={
            socket && room ? (
              <Room
                socket={socket}
                room={room}
                username={username}
                isScrumMaster={isScrumMaster}
                joinedUsers={users}
                setIsScrumMaster={setIsScrumMaster}
              />
            ) : (
              <RoomCreation createRoom={createRoom} joinRoom={joinRoom} room={null} />
            )
          }
        />
        <Route path="/changelog" element={<Changelog />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;