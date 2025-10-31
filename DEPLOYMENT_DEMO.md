# Demo Deployment Guide - Caddy with Let's Encrypt

## Problem: Port Conflict with Traefik

Port 80 is already used by Traefik (`portainer-edge-gateway_traefik`).

**For Let's Encrypt to work**, Caddy needs port 80 for HTTP challenge.

## Solution: Temporary Traefik Stop (Recommended for Demo)

### Step 1: Stop Traefik Temporarily

```bash
# Scale Traefik down to 0 (stop it)
docker service scale portainer-edge-gateway_traefik=0

# Verify Traefik is stopped
docker service ps portainer-edge-gateway_traefik
```

### Step 2: Deploy Demo Stack

1. Go to Portainer → Stacks
2. Create new stack: `lgd-demo`
3. Paste `docker-compose.yml` content
4. Deploy

Or via command line:
```bash
docker stack deploy -c docker-compose.yml lgd-demo
```

### Step 3: Verify Demo Works

- **HTTPS:** `https://lgd-demo.duckdns.org/`
- **Health:** `https://lgd-demo.duckdns.org/health`

Caddy will automatically get Let's Encrypt certificate (first request may take ~10 seconds).

### Step 4: Restore Traefik (After Demo)

```bash
# Scale Traefik back to 1 (restart it)
docker service scale portainer-edge-gateway_traefik=1

# Verify Traefik is running
docker service ps portainer-edge-gateway_traefik
```

## Alternative: Use Traefik as Proxy (Without Let's Encrypt in Caddy)

If you want to keep Traefik running:

1. Use alternative ports (8080/8443) for Caddy
2. Configure Traefik to proxy to Caddy on port 8080
3. **Problem:** Caddy won't get Let's Encrypt cert (needs port 80)
4. Use Traefik's Let's Encrypt instead

**Not recommended for demo** - loses benefit of Caddy's automatic HTTPS.

## Quick Commands

### Stop Traefik
```bash
docker service scale portainer-edge-gateway_traefik=0
```

### Start Traefik
```bash
docker service scale portainer-edge-gateway_traefik=1
```

### Check Port Usage
```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

### Check Services
```bash
docker service ls
docker service ps lgd-demo_lgd-map
```

## Notes

- **For demo/showcase:** Stopping Traefik temporarily is fine
- **For production:** Consider using Traefik for all services (centralized management)
- **Port conflict:** Only one service can use port 80 at a time

## Troubleshooting

### Port 80 Still in Use

```bash
# Check what's using port 80
sudo lsof -i :80
sudo netstat -tlnp | grep :80

# Force kill if needed (not recommended)
sudo fuser -k 80/tcp
```

### Let's Encrypt Certificate Not Obtained

1. Check DNS: `nslookup lgd-demo.duckdns.org` (should show VPS IP)
2. Check port 80: `curl -I http://lgd-demo.duckdns.org/.well-known/acme-challenge/test`
3. Check Caddy logs: `docker logs lgd-demo_lgd-map`

### After Demo - Restore Traefik

Remember to restart Traefik after demo:

```bash
docker service scale portainer-edge-gateway_traefik=1
```

This will restore Traefik for your other services (WordPress, etc.).

