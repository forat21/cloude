# Use Node.js runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY client/ ./client/

# Install dependencies
RUN cd server && npm install

# Copy source code
COPY server/ ./server/

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start", "--prefix", "server"]