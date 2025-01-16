import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  useEffect(() => {
    const newSocket = io('https://poker.letsprogram.in');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const storedRoom = sessionStorage.getItem('room');
    const storedUsername = sessionStorage.getItem('username');
    const storedIsScrumMaster = sessionStorage.getItem('isScrumMaster');
    const storedUsers = sessionStorage.getItem('users');

    if (storedRoom && storedUsername && storedIsScrumMaster && storedUsers) {
      setRoom(storedRoom);
      setUsername(storedUsername);
      setIsScrumMaster(storedIsScrumMaster === 'true');
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    if (room && username && isScrumMaster !== null && users.length > 0) {
      sessionStorage.setItem('room', room);
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('isScrumMaster', isScrumMaster.toString());
      sessionStorage.setItem('users', JSON.stringify(users));
    } else {
      sessionStorage.removeItem('room');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('isScrumMaster');
      sessionStorage.removeItem('users');
    }
  }, [room, username, isScrumMaster, users]);

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
      <header className={`
        fixed top-0 right-0 left-0 z-50
        flex justify-between items-center
        px-6 h-16
        ${theme === "dark" 
          ? "bg-gray-900/95 border-gray-800" 
          : "bg-white/95 border-gray-200"
        }
        border-b backdrop-blur-md shadow-lg
      `}>
        <div className="flex gap-4 items-center">
          <Link 
            to="/" 
            className={`
              text-xl font-bold tracking-tight
              ${theme === "dark" 
                ? "text-white hover:text-blue-400" 
                : "text-gray-900 hover:text-blue-600"
              }
              transition-colors duration-200
            `}
          >
            Scrum Poker
          </Link>
          {room && (
            <Link
              to={`/room/${room}`}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                ${theme === "dark" 
                  ? "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 hover:text-white" 
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                }
                backdrop-blur-sm transition-all duration-200
              `}
            >
              Room: {room}
            </Link>
          )}
        </div>

        <div className="flex gap-3 items-center">
          <Link
            to="/changelog"
            className={`
              px-3 py-2 rounded-lg
              flex items-center gap-2
              ${theme === "dark" 
                ? "text-gray-300 hover:text-white hover:bg-gray-800/80" 
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
              }
              transition-all duration-200 backdrop-blur-sm
            `}
            title="View Changelog"
            state={{ previousRoom: room, username, isScrumMaster, users }}
          >
            <History className="w-4 h-4" />
            <span className="hidden text-sm sm:inline">Changelog</span>
          </Link>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTheme}
            className={`
              px-3 py-2 rounded-lg
              flex items-center gap-2
              ${theme === "dark"
                ? "bg-gray-800/80 text-gray-300 hover:text-yellow-300 hover:bg-gray-700/80"
                : "bg-gray-100/80 text-gray-600 hover:text-blue-600 hover:bg-gray-200/80"
              }
              transition-all duration-200 backdrop-blur-sm
            `}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4" />
                <span className="hidden text-sm sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span className="hidden text-sm sm:inline">Dark</span>
              </>
            )}
          </motion.button>
        </div>
      </header>
      <main className="pt-16">
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
          <Route
            path="/changelog"
            element={
              <Changelog
                previousRoom={location.state?.previousRoom}
                username={location.state?.username}
                isScrumMaster={location.state?.isScrumMaster}
                users={location.state?.users}
              />
            }
          />
        </Routes>
      </main>
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