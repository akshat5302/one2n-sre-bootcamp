# Stage 1: Build stage
FROM node:20 AS builder

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build the app (if needed)
# RUN npm run build   # Uncomment this if you have a build step

# Stage 2: Production stage
FROM node:20-slim

RUN apt-get update && apt-get install -y postgresql-client && apt-get clean

# Create app directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/package*.json ./
RUN npm install --only=production

# Copy the built app from the build stage
COPY --from=builder /app .

# Expose port and define entrypoint
EXPOSE 3000
CMD ["node", "src/server.js"]
