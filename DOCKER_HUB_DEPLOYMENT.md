# Deploy to AWS ECR

## Build & Push

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build
docker build -t next-level-portfolio-server .

# Tag
docker tag next-level-portfolio-server:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/next-level-portfolio-server:latest

# Push
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/next-level-portfolio-server:latest
```

## Pull on EC2

```bash
# Login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Pull & Run
docker pull YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/next-level-portfolio-server:latest
docker run -d -p 3000:3000 --env-file .env YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/next-level-portfolio-server:latest
```
