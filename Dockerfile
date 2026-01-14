# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install dependencies
RUN npm ci || npm install

# Copy source code
COPY . .

# Build the Astro project
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Install only production dependencies (optional - Astro static sites may not need this)
COPY package.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Expose port
EXPOSE 3000

# Start the preview server
CMD ["npm", "run", "preview"]
