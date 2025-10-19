# 🚀 Deployment Guide - LGD Owocowy Szlak Map

## 📋 Overview

This guide explains how to deploy the LGD Map application using Docker containers with Traefik reverse proxy.

## 🏗️ Architecture

- **Frontend**: React/TypeScript application served by Nginx
- **Container**: Docker with multi-stage build
- **Reverse Proxy**: Traefik with automatic SSL certificates
- **CI/CD**: GitHub Actions with automated builds and deployments

## 🔧 Prerequisites

### Server Requirements
- Docker & Docker Compose installed
- Traefik running with `traefik-public` network
- Portainer for container management
- GitHub repository with proper secrets configured

### GitHub Secrets Required
Configure these in your GitHub repository settings:

```
PORTAINER_STAGING_WEBHOOK_1=https://your-portainer.com/api/webhooks/your-webhook-id
PORTAINER_STAGING_WEBHOOK_2=https://your-portainer.com/api/webhooks/your-webhook-id-2
PORTAINER_PRODUCTION_WEBHOOK=https://your-portainer.com/api/webhooks/your-production-webhook
```

## 🚀 Deployment Process

### 1. Automatic Deployment (Recommended)

The application is automatically deployed when you push to specific branches:

- **Staging**: Push to `staging` branch → Deploys to demo environment
- **Production**: Push to `main` branch → Deploys to production environment

### 2. Manual Deployment

#### Build and Test Locally
```bash
# Build the application
npm run build:prod

# Test with Docker Compose
docker-compose -f docker-compose.local.yml up --build

# Check if application is running
curl http://localhost:8080/health
```

#### Deploy to Server
1. Copy `docker-compose.yml` to your server
2. Update the image tag if needed
3. Deploy using Portainer or Docker Compose

```bash
# Using Docker Compose
docker-compose up -d

# Using Portainer
# Import the docker-compose.yml as a new stack
```

## 🌐 Access URLs

### Demo Environment
- **URL**: `https://57.129.41.248/lgd-demo`
- **Health Check**: `https://57.129.41.248/lgd-demo/health`

### Production Environment
- **URL**: Configure based on your domain
- **Health Check**: `https://your-domain.com/health`

## 🔧 Configuration

### Environment Variables
```yaml
environment:
  - NODE_ENV=production
  - PORT=8080
```

### Resource Limits
```yaml
deploy:
  resources:
    limits:
      memory: 256M
      cpus: '0.5'
    reservations:
      memory: 128M
      cpus: '0.25'
```

### Traefik Labels
The application is configured with Traefik labels for:
- Automatic SSL certificates (Let's Encrypt)
- Path prefix stripping (`/lgd-demo`)
- Security headers
- Compression
- Rate limiting

## 📊 Monitoring

### Health Checks
- **Container Health**: Built-in Docker health check
- **Application Health**: `/health` endpoint
- **Traefik Health**: Automatic through Traefik

### Logs
```bash
# View container logs
docker logs lgd-map-demo

# Follow logs in real-time
docker logs -f lgd-map-demo
```

## 🔒 Security Features

### Container Security
- Non-root user execution
- Minimal Alpine Linux base image
- No unnecessary packages
- Regular security scans with Trivy

### Network Security
- HTTPS only (HTTP redirects to HTTPS)
- Security headers (HSTS, CSP, XSS protection)
- Rate limiting
- Frame protection

## 🛠️ Troubleshooting

### Common Issues

#### 1. Container Won't Start
```bash
# Check container logs
docker logs lgd-map-demo

# Check if port is available
netstat -tlnp | grep 8080
```

#### 2. Application Not Accessible
- Verify Traefik labels are correct
- Check if `traefik-public` network exists
- Ensure SSL certificates are valid

#### 3. Build Failures
- Check GitHub Actions logs
- Verify all dependencies are installed
- Ensure `build:prod` script works locally

### Debug Commands
```bash
# Test container locally
docker-compose -f docker-compose.local.yml up --build

# Check Traefik configuration
docker exec traefik cat /etc/traefik/traefik.yml

# Verify network connectivity
docker network ls | grep traefik-public
```

## 📈 Performance Optimization

### Caching
- Static assets cached for 1 year
- HTML files cached for 1 hour
- Gzip compression enabled

### Resource Management
- Memory limit: 256MB
- CPU limit: 0.5 cores
- Automatic restart on failure

## 🔄 Updates and Rollbacks

### Updates
1. Push changes to `staging` or `main` branch
2. GitHub Actions automatically builds and deploys
3. Portainer webhooks trigger container updates

### Rollbacks
1. Use Portainer to rollback to previous image
2. Or manually update image tag in docker-compose.yml

## 📞 Support

For issues or questions:
1. Check GitHub Actions logs
2. Review container logs
3. Verify Traefik configuration
4. Test locally with docker-compose.local.yml

## 🎯 Next Steps

1. Configure your domain name
2. Set up monitoring and alerting
3. Implement backup strategies
4. Consider scaling options if needed