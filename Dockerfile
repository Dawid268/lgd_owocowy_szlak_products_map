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

# Create non-root user (Caddy already runs as non-root by default)
# Caddy runs as user caddy (UID 101) by default, but we'll ensure proper ownership
RUN chown -R caddy:caddy /usr/share/caddy/html && \
    chown -R caddy:caddy /etc/caddy

# Caddy already runs as non-root user (caddy:caddy)
# No need to switch user - Caddy handles this

# Expose ports 80 (HTTP) and 443 (HTTPS)
# Caddy will automatically get Let's Encrypt certificate via HTTP challenge on port 80
EXPOSE 80 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
