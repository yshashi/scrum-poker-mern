import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import LandingPage from './components/LandingPage';
import RoomCreation from './components/RoomCreation';
import Room, { User } from './components/Room';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [isScrumMaster, setIsScrumMaster] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
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
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/create"
          element={<RoomCreation createRoom={createRoom} joinRoom={joinRoom} room={room as string} />}
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
              <RoomCreation createRoom={createRoom} joinRoom={joinRoom} room= {null} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;