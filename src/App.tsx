import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import LandingPage from './components/LandingPage';
import RoomCreation from './components/RoomCreation';
import Room, { User } from './components/Room';
import { ThemeProvider } from './contexts/ThemeContext';

const App: React.FC = () => {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [room, setRoom] = React.useState<string | null>(null);
  const [username, setUsername] = React.useState<string>('');
  const [isScrumMaster, setIsScrumMaster] = React.useState<boolean>(false);
  const [users, setUsers] = React.useState<User[]>([]);

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
    <ThemeProvider>
      <Router>
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;