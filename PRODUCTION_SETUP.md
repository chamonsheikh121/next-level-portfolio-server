# Production Deployment Setup

## Files to Copy to EC2

Copy these files to your EC2 instance at `/home/ubuntu/next-level-portfolio-server/`:

1. `docker-compose.production.yml`
2. `.env.production`

## EC2 Setup Commands

```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Create directory
mkdir -p /home/ubuntu/next-level-portfolio-server
cd /home/ubuntu/next-level-portfolio-server

# Create uploads directory
mkdir -p uploads
```

## Copy Files from Local

From your local machine:

```bash
# Copy docker-compose.production.yml
scp -i your-key.pem docker-compose.production.yml ubuntu@your-ec2-ip:/home/ubuntu/next-level-portfolio-server/

# Copy .env.production
scp -i your-key.pem .env.production ubuntu@your-ec2-ip:/home/ubuntu/next-level-portfolio-server/
```

## Update .env.production on EC2

Edit the file to add production values:

```bash
nano .env.production
```

Update:

- `JWT_SECRET` - Use strong production secret
- `CORS_ORIGIN` - Your frontend domain
- `EMAIL_*` - Your email credentials
- `CLOUDINARY_*` - Your Cloudinary credentials
- Other sensitive values

## First Time Deployment

On EC2:

```bash
cd /home/ubuntu/next-level-portfolio-server

# Login to Docker Hub
docker login

# Pull and run
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d

# Check logs
docker logs portfolio_app -f
```

## Verify Deployment

```bash
# Check running containers
docker ps

# Check logs
docker logs portfolio_app
docker logs portfolio_postgres
docker logs portfolio_redis

# Test API
curl http://localhost:3000/api
```

## After First Setup

From now on, the GitHub Actions CI/CD will:

1. Build Docker image on push to main
2. Push to Docker Hub
3. SSH to EC2
4. Pull latest image
5. Restart containers automatically

No manual intervention needed! 🚀
