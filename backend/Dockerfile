# WaveGuard Backend - Production Dockerfile
# Optimized for DigitalOcean App Platform and Droplets

FROM node:20-slim

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application files
COPY . .

# Create cache directory for AI models
RUN mkdir -p /tmp/ai-models && chmod 777 /tmp/ai-models

# Expose port (DigitalOcean will override with PORT env var)
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]
