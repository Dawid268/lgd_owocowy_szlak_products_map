# Caddy Integration - Automatic HTTPS for Demo

## Overview

This demo now uses **Caddy** instead of Traefik for automatic HTTPS with Let's Encrypt.

**Benefits:**
- ✅ Automatic HTTPS with Let's Encrypt (zero configuration)
- ✅ HTTP to HTTPS redirect (automatic)
- ✅ Everything in one Docker image
- ✅ No need for Traefik configuration
- ✅ Perfect for client demos

## Architecture

```
User → Caddy (port 80/443) → Static Files (/usr/share/caddy/html)
                          ↓
                    Let's Encrypt (automatic)
```

## How It Works

1. **Caddy** runs inside the Docker container
2. **Caddyfile** configures domain and static file serving
3. **Let's Encrypt** certificate is automatically obtained via HTTP challenge on port 80
4. **HTTPS** is automatically enabled for `lgd-demo.duckdns.org`

## Configuration

### Caddyfile

The `Caddyfile` defines:
- Domain: `lgd-demo.duckdns.org`
- Static file serving from `/usr/share/caddy/html`
- Security headers
- Compression (gzip)
- Cache headers for static assets

### Docker Compose

- **Ports:** 80 (HTTP) and 443 (HTTPS) exposed
- **Volumes:** `caddy_data` and `caddy_config` for certificate persistence
- **No Traefik labels needed** - Caddy handles everything

## Deployment

### 1. Build Image

```bash
docker build -t ghcr.io/dawid268/lgd_owocowy_szlak_products_map/lgd-map:staging .
```

### 2. Push to Registry (if needed)

```bash
docker push ghcr.io/dawid268/lgd_owocowy_szlak_products_map/lgd-map:staging
```

### 3. Deploy with Docker Compose

```bash
docker-compose up -d
```

Or in Portainer:
1. Go to Stacks
2. Create new stack or update existing
3. Paste `docker-compose.yml` content
4. Deploy

## Prerequisites

### DNS Configuration

**Important:** DuckDNS must point to your VPS IP:

1. Go to https://www.duckdns.org/
2. Verify `lgd-demo` subdomain points to your VPS IP: `57.129.41.248`
3. Update if needed (DNS propagation: 1-5 minutes)

### Firewall

Port 80 must be accessible from internet for Let's Encrypt HTTP challenge:

```bash
# Check firewall
sudo ufw status

# Open ports if needed
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Access

After deployment:
- **HTTPS:** `https://lgd-demo.duckdns.org/`
- **Health check:** `https://lgd-demo.duckdns.org/health`

Caddy will automatically:
1. Get Let's Encrypt certificate (first request may take ~10 seconds)
2. Enable HTTPS
3. Redirect HTTP to HTTPS

## Troubleshooting

### Certificate Not Obtained

**Check DNS:**
```bash
nslookup lgd-demo.duckdns.org
# Should show: 57.129.41.248
```

**Check port 80:**
```bash
curl -I http://lgd-demo.duckdns.org/.well-known/acme-challenge/test
# Should return 404 (not connection refused)
```

**Check Caddy logs:**
```bash
docker logs lgd-map-demo
```

### Certificate Renewal

Caddy automatically renews Let's Encrypt certificates (every 60 days, renews at 30 days).

Certificates are stored in `caddy_data` volume, so they persist between container restarts.

## Differences from Traefik Setup

| Feature | Traefik | Caddy |
|---------|---------|-------|
| HTTPS | Manual Let's Encrypt config | Automatic |
| Configuration | Docker labels | Caddyfile |
| Ports | Managed by Traefik | Direct 80/443 |
| Certificates | Manual renewal | Automatic renewal |
| Setup | Complex | Simple |

## For Production

For production, consider:
- Using Traefik for multiple services (centralized management)
- Cloudflare Tunnel for additional security
- Monitoring and logging

For **demo/showcase purposes**, Caddy is perfect! 🚀

