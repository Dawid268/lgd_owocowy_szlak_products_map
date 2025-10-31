# Multi-stage build for production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies for build (including dev dependencies)
RUN npm ci --ignore-scripts && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build:prod

# Production stage with Caddy (automatic HTTPS with Let's Encrypt)
FROM caddy:2.7-alpine AS production

# Install curl for health checks (Caddy image already includes it)
RUN apk add --no-cache curl || true

# Copy Caddyfile configuration
COPY Caddyfile /etc/caddy/Caddyfile

# Copy built application
COPY --from=builder /app/dist /usr/share/caddy/html

# Set proper permissions for Caddy
# Caddy Alpine image runs as root by default, but we ensure files are readable
RUN chmod -R 755 /usr/share/caddy/html && \
    chmod 644 /etc/caddy/Caddyfile

# Note: Caddy Alpine image runs as root by default for simplicity
# For production, you might want to configure non-root user, but for demo this is fine

# Expose ports 80 (HTTP) and 443 (HTTPS)
# Caddy will automatically get Let's Encrypt certificate via HTTP challenge on port 80
# Traefik proxies traffic to these ports
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
