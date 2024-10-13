import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('create-room', (username, callback) => {
    const roomId = uuidv4();
    rooms.set(roomId, {
      users: [{ id: socket.id, name: username, estimate: null }],
      scrumMaster: socket.id,
    });
    socket.join(roomId);
    callback(roomId);
    io.to(roomId).emit('user-joined', rooms.get(roomId).users);
  });

  socket.on('join-room', (roomId, username, callback) => {
    const room = rooms.get(roomId);
    if (room) {
      room.users.push({ id: socket.id, name: username, estimate: null });
      socket.join(roomId);
      callback(true);
      io.to(roomId).emit('user-joined', room.users);
    } else {
      callback(false);
    }
  });

  socket.on('submit-estimate', (roomId, estimate) => {
    const room = rooms.get(roomId);
    if (room) {
      const user = room.users.find((u) => u.id === socket.id);
      if (user) {
        user.estimate = estimate;
        io.to(roomId).emit('estimate-submitted', room.users);
      }
    }
  });

  socket.on('reveal-estimates', (roomId) => {
    const room = rooms.get(roomId);
    if (room && room.scrumMaster === socket.id) {
      io.to(roomId).emit('estimates-revealed', true);
    }
  });

  socket.on('reset-estimates', (roomId) => {
    const room = rooms.get(roomId);
    if (room && room.scrumMaster === socket.id) {
      room.users.forEach((user) => {
        user.estimate = null;
      });
      io.to(roomId).emit('estimate-submitted', room.users);
      io.to(roomId).emit('estimates-revealed', false);
    }
  });

  socket.on('change-scrum-master', (roomId, newScrumMasterId) => {
    const room = rooms.get(roomId);
    if (room && room.scrumMaster === socket.id) {
      room.scrumMaster = newScrumMasterId;
      io.to(roomId).emit('scrum-master-changed', newScrumMasterId);
    }
  });

  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.users = room.users.filter((user) => user.id !== socket.id);
        if (room.users.length === 0) {
          rooms.delete(roomId);
        } else {
          if (room.scrumMaster === socket.id) {
            room.scrumMaster = room.users[0].id;
            io.to(roomId).emit('scrum-master-changed', room.scrumMaster);
          }
          io.to(roomId).emit('user-left', room.users);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});