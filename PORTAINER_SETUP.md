# 🐳 Portainer Setup Guide - LGD Map

## 📋 Overview

This guide explains how to deploy the LGD Map application using Portainer with Traefik reverse proxy.

## 🚀 Quick Setup

### 1. Import Stack in Portainer

1. **Login to Portainer**
2. **Go to Stacks** → **Add Stack**
3. **Name**: `lgd-map-demo`
4. **Copy the contents of `docker-compose.yml`**
5. **Set Environment Variables**:
   ```
   GITHUB_REPOSITORY=dawid268/lgd_owocowy_szlak_products_map
   ```
6. **Deploy the Stack**

### 2. Configure GitHub Secrets

In your GitHub repository settings, add these secrets:

```
PORTAINER_STAGING_WEBHOOK_1=https://your-portainer.com/api/webhooks/your-webhook-id
PORTAINER_STAGING_WEBHOOK_2=https://your-portainer.com/api/webhooks/your-webhook-id-2
PORTAINER_PRODUCTION_WEBHOOK=https://your-portainer.com/api/webhooks/your-production-webhook
```

### 3. Access Your Application

- **Demo URL**: `https://57.129.41.248/lgd-demo`
- **Health Check**: `https://57.129.41.248/lgd-demo/health`

## 🔧 Detailed Configuration

### Docker Compose Configuration

The `docker-compose.yml` includes:

- **Image**: `ghcr.io/your-repo/lgd-map:staging`
- **Port**: 8080 (internal)
- **Traefik Labels**: Automatic SSL, path stripping, security headers
- **Resource Limits**: 256MB RAM, 0.5 CPU cores
- **Health Checks**: Built-in container health monitoring

### Traefik Integration

The application is configured with Traefik labels for:

- **Host Rule**: `Host(57.129.41.248) && PathPrefix(/lgd-demo)`
- **SSL**: Automatic Let's Encrypt certificates
- **Path Stripping**: Removes `/lgd-demo` prefix
- **Security Headers**: HSTS, CSP, XSS protection
- **Compression**: Gzip compression enabled

### Network Configuration

- **Network**: `traefik-public` (external network)
- **Entry Points**: `websecure` (HTTPS only)
- **Certificate Resolver**: `letsencrypt`

## 🔄 Deployment Workflow

### Automatic Deployment

1. **Push to `staging` branch** → Deploys demo version
2. **Push to `main` branch** → Deploys production version
3. **GitHub Actions** builds and pushes Docker image
4. **Portainer Webhooks** trigger container updates

### Manual Deployment

1. **Build locally**:
   ```bash
   npm run build:prod
   docker build -t lgd-map-test .
   ```

2. **Test locally**:
   ```bash
   docker-compose -f docker-compose.local.yml up --build
   ```

3. **Deploy to server**:
   - Update image tag in Portainer
   - Or redeploy the stack

## 📊 Monitoring

### Health Checks

- **Container Health**: Docker built-in health check
- **Application Health**: `/health` endpoint
- **Traefik Health**: Automatic through Traefik

### Logs

In Portainer:
1. **Go to Containers** → **lgd-map-demo**
2. **Click Logs** to view real-time logs
3. **Check for errors** or performance issues

### Resource Usage

Monitor in Portainer:
- **CPU Usage**: Should stay under 0.5 cores
- **Memory Usage**: Should stay under 256MB
- **Network**: Check for any connection issues

## 🛠️ Troubleshooting

### Common Issues

#### 1. Container Won't Start
- Check **Logs** in Portainer
- Verify **Image** exists: `ghcr.io/your-repo/lgd-map:staging`
- Check **Resource Limits** are sufficient

#### 2. Application Not Accessible
- Verify **Traefik Labels** are correct
- Check **Network** configuration (`traefik-public`)
- Ensure **SSL Certificates** are valid

#### 3. Build Failures
- Check **GitHub Actions** logs
- Verify **Dockerfile** builds locally
- Check **Dependencies** are up to date

### Debug Commands

```bash
# Check container status
docker ps | grep lgd-map

# View container logs
docker logs lgd-map-demo

# Check Traefik configuration
docker exec traefik cat /etc/traefik/traefik.yml

# Test health endpoint
curl https://57.129.41.248/lgd-demo/health
```

## 🔒 Security Features

### Container Security
- **Non-root user** execution
- **Minimal Alpine Linux** base image
- **Regular security scans** with Trivy
- **Resource limits** to prevent resource exhaustion

### Network Security
- **HTTPS only** (HTTP redirects to HTTPS)
- **Security headers** (HSTS, CSP, XSS protection)
- **Rate limiting** to prevent abuse
- **Frame protection** against clickjacking

## 📈 Performance Optimization

### Caching
- **Static assets**: Cached for 1 year
- **HTML files**: Cached for 1 hour
- **Gzip compression**: Enabled for all text content

### Resource Management
- **Memory limit**: 256MB
- **CPU limit**: 0.5 cores
- **Automatic restart**: On failure
- **Health checks**: Every 30 seconds

## 🔄 Updates and Rollbacks

### Updates
1. **Push changes** to `staging` or `main` branch
2. **GitHub Actions** automatically builds and deploys
3. **Portainer webhooks** trigger container updates

### Rollbacks
1. **Use Portainer** to rollback to previous image
2. **Or manually update** image tag in docker-compose.yml
3. **Redeploy the stack** with previous image

## 📞 Support

For issues or questions:
1. **Check Portainer logs**
2. **Review GitHub Actions logs**
3. **Verify Traefik configuration**
4. **Test locally** with docker-compose.local.yml

## 🎯 Next Steps

1. **Configure your domain name** (if different from 57.129.41.248)
2. **Set up monitoring and alerting**
3. **Implement backup strategies**
4. **Consider scaling options** if needed
5. **Set up automated testing** in CI/CD pipeline
