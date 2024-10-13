import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

// Create a __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'https://pocker.letsprogram.in',
    methods: ['GET', 'POST'],
  },
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');
  console.log(`Total connected users: ${io.sockets.adapter.rooms.size}`);

  socket.on('create-room', (username, callback) => {
    const roomId = uuidv4();
    rooms.set(roomId, {
      users: [{ id: socket.id, name: username, estimate: null }],
      scrumMaster: socket.id,
      lastActivity: Date.now() // Set initial timestamp
    });
    socket.join(roomId);
    callback(roomId);
    io.to(roomId).emit('user-joined', rooms.get(roomId).users);
    // total connected users
    console.log(`Total connected users: ${io.sockets.adapter.rooms.size}`);
  });

  socket.on('join-room', (roomId, username, callback) => {
    const room = rooms.get(roomId);
    if (room) {
      room.users.push({ id: socket.id, name: username, estimate: null });
      socket.join(roomId);
      room.lastActivity = Date.now(); // Update timestamp when user joins
      callback(true);
      io.to(roomId).emit('user-joined', room.users);
    } else {
      callback(false);
    }
  });

  socket.on('submit-estimate', (roomId, estimate) => {
    const room = rooms.get(roomId);
    if (room) {
      room.lastActivity = Date.now(); // Update timestamp when an estimate is submitted
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
      room.lastActivity = Date.now(); // Update room activity
      io.to(roomId).emit('estimates-revealed', true);
    }
  });

// hide estimates
  socket.on('hide-estimates', (roomId) => {
    const room = rooms.get(roomId);
    if (room && room.scrumMaster === socket.id) {
      room.lastActivity = Date.now(); // Update room activity
      io.to(roomId).emit('estimates-revealed', false);
    }
  });

  socket.on('reset-estimates', (roomId) => {
    const room = rooms.get(roomId);
    if (room && room.scrumMaster === socket.id) {
      room.lastActivity = Date.now(); // Update room activity
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
      room.lastActivity = Date.now(); // Update room activity
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
          console.log(`Total connected users: ${io.sockets.adapter.rooms.size}`);
          io.to(roomId).emit('user-left', room.users);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Serve static files from the React app (built files in public directory)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the React app's index.html for any route not handled by socket.io
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3002;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Job: Clean up inactive rooms every 2 hours
function cleanUpInactiveRooms() {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

  console.log("A clean up job has been scheduled.");

  rooms.forEach((room, roomId) => {
    if (now - room.lastActivity > oneHour) {
      // If the room has been inactive for more than 1 hour, remove it
      rooms.delete(roomId);
      io.to(roomId).emit('room-destroyed', roomId); // Optional: notify users
      io.socketsLeave(roomId); // Ensure all users leave the room
      console.log(`Room ${roomId} has been destroyed due to inactivity.`);
    }
  });
}

// Schedule the cleanup job to run every 2 hours
setInterval(cleanUpInactiveRooms, 2 * 60 * 60 * 1000); // 2 hours in milliseconds