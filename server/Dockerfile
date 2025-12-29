# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Expose port (default 5001, but can be overridden)
EXPOSE 5001

# Start the server
CMD ["node", "index.js"]

