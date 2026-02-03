# Stage 1: Build the NestJS application
FROM node:25-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Install dependencies (including dev for build)
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:25-alpine

# Set production environment
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install only production deps
COPY package*.json ./
RUN npm install --production

# Copy built output from builder
COPY --from=builder /usr/src/app/dist ./dist

# Use non-root user
USER node

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]