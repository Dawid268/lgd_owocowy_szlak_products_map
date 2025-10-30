# Troubleshooting - lgd-demo.duckdns.org

## Problem: 404 Not Found

**Symptom:** `https://lgd-demo.duckdns.org/` returns 404

**Causes:**
1. Stack not updated after Traefik router changes
2. Router not connected to service
3. Cloudflare Tunnel route missing (if using Cloudflare)

**Solution:**
1. Update stack in Portainer with new `docker-compose.yml`
2. Wait 1-2 minutes for Traefik to reload configuration
3. Check Traefik logs: `docker service logs edge-gateway_traefik | grep lgd-demo`

## Problem: Let's Encrypt Certificate Error

**Symptom:** Certificate errors or self-signed certificate for `lgd-demo.duckdns.org`

**Error messages:**
```
Unable to obtain ACME certificate for domains [lgd-demo.duckdns.org]: 
- Connection refused (port 80 not accessible)
- DNS problem: SERVFAIL looking up CAA
```

**Causes:**
1. Port 80 not publicly accessible (firewall blocking)
2. DuckDNS not pointing to VPS IP
3. Cloudflare Tunnel blocking direct access to port 80

**Solutions:**

### Solution 1: Fix DuckDNS Configuration
1. Check DuckDNS: https://www.duckdns.org/
2. Verify domain `lgd-demo` points to your VPS IP: `57.129.41.248`
3. Update if needed (DNS propagation: 1-5 minutes)

### Solution 2: Open Port 80 in Firewall
```bash
# Check if port 80 is open
sudo ufw status
sudo netstat -tlnp | grep :80

# If needed, open port 80
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Solution 3: Use Default Certificate (Temporary)
If Let's Encrypt fails, Traefik will automatically use default self-signed certificate.
This allows the site to work, but browsers will show certificate warning.

**For production:** Fix DNS and port 80 access to get Let's Encrypt certificate.

### Solution 4: Disable Cloudflare Tunnel for This Domain
If using Cloudflare Tunnel for other domains but want direct access for demo:

1. Don't add route in Cloudflare Tunnel for `lgd-demo.duckdns.org`
2. Access directly via `https://lgd-demo.duckdns.org/` (bypass Cloudflare)
3. Ensure port 80 is accessible for Let's Encrypt HTTP challenge

### Solution 5: Use IP Access (No Certificate Needed)
For demo/testing, use IP access:
- `https://57.129.41.248/lgd-demo` (with path prefix)
- This route has Let's Encrypt certificate for IP

**Note:** IP certificates from Let's Encrypt are not commonly issued. Self-signed is expected.

## Current Configuration

- **Domain route:** `lgd-demo.duckdns.org` → Let's Encrypt (may fallback to default cert)
- **IP route:** `57.129.41.248/lgd-demo` → Let's Encrypt (if available)

## Checking Status

```bash
# Check Traefik routers
curl http://localhost:8080/api/http/routers | jq '.[] | select(.name | contains("lgd-map"))'

# Check certificates
docker exec $(docker ps -q -f name=traefik) ls -la /certs/

# Check ACME status
docker service logs edge-gateway_traefik | grep -i acme | tail -20

# Test DNS
nslookup lgd-demo.duckdns.org
dig lgd-demo.duckdns.org

# Test HTTP challenge endpoint (should return 404, not connection refused)
curl -I http://lgd-demo.duckdns.org/.well-known/acme-challenge/test
```

## Quick Fix for Demo

For quick demo access without fixing Let's Encrypt:

1. **Use default self-signed certificate:**
   - Site will work but browsers show warning
   - Click "Advanced" → "Proceed anyway" in browser

2. **Use IP access:**
   - `https://57.129.41.248/lgd-demo`
   - No certificate warnings (if IP cert available)

3. **Temporary HTTP (for testing only):**
   - Use `http://` instead of `https://`
   - Not recommended for production

