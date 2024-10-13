# Stage 1: Build the React app
FROM node:22 AS build

WORKDIR /app

# Copy both frontend and server code
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY ./ ./

# Install dependencies and build the frontend
RUN npm install
RUN npm run build

# Stage 2: Serve the built React app with the Node.js server
FROM node:22

WORKDIR /app

# Copy the build from the previous stage
COPY --from=build /app/dist ./public
COPY --from=build /app/server.js ./
COPY --from=build /app/package*.json ./

# Install server dependencies
RUN npm install --only=production

EXPOSE 3001

# Start the Node.js server
CMD ["node", "server.js"]
