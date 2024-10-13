import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import RoomCreation from './components/RoomCreation';
import Room from './components/Room';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [isScrumMaster, setIsScrumMaster] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io('https://poker.letsprogram.in/');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createRoom = (name: string) => {
    if (socket) {
      socket.emit('create-room', name, (roomId: string) => {
        setRoom(roomId);
        setUsername(name);
        setIsScrumMaster(true);
      });
    }
  };

  const joinRoom = (roomId: string, name: string) => {
    if (socket) {
      socket.emit('join-room', roomId, name, (success: boolean) => {
        if (success) {
          setRoom(roomId);
          setUsername(name);
        } else {
          alert('Failed to join room. Please check the room ID and try again.');
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {!room ? (
        <RoomCreation createRoom={createRoom} joinRoom={joinRoom} />
      ) : (
        <Room
          socket={socket!}
          room={room}
          username={username}
          isScrumMaster={isScrumMaster}
          setIsScrumMaster={setIsScrumMaster}
        />
      )}
    </div>
  );
};

export default App;