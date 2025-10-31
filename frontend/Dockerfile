# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Install serve for static file serving
RUN npm install -g serve

# Copy built files
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start server
CMD sh -c "serve -s dist -l 0.0.0.0:${PORT:-3000}"
