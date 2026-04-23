# Setup Guide

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Git
- AWS Account (for cloud deployment)

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/empathy-for-learning.git
cd empathy-for-learning
```

### 2. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install poetry
poetry install

# Create environment file
cp .env.example .env
# Edit .env with local database URLs

# Start local services (MongoDB, Redis, API Gateway)
docker-compose up
```

Verify backend: `curl http://localhost:8000/health`

### 3. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Verify frontend: Open `http://localhost:3000` in browser

### 4. Testing

```bash
# Backend tests
cd backend
poetry run pytest

# Frontend tests
cd frontend
npm run test
```

## AWS Deployment

### 1. Prerequisites

- AWS Account with billing alerts enabled
- IAM user (empathy-dev) with appropriate permissions
- AWS CLI configured

### 2. Provision Services

```bash
# MongoDB Atlas
1. Create cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update backend/.env MONGODB_URL

# Redis ElastiCache
1. AWS Console → ElastiCache
2. Create Redis 7.0 cluster
3. Get endpoint
4. Update backend/.env REDIS_URL

# SQS Queues
1. AWS Console → SQS
2. Create queues: empathy-interactions, empathy-errors
3. Get queue URLs
4. Update backend/.env SQS_*_QUEUE

# Secrets Manager
1. AWS Console → Secrets Manager
2. Create secret with all keys from .env
3. Note the secret ARN
```

### 3. Deploy Backend

```bash
# Build and push Docker image
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com
docker build -t empathy-backend:latest .
docker tag empathy-backend:latest YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/empathy-backend:latest
docker push YOUR_ACCOUNT_ID.dkr.ecr.ap-south-1.amazonaws.com/empathy-backend:latest

# Deploy to ECS Fargate (using AWS Console or Terraform)
```

### 4. Deploy Frontend

```bash
# Build Next.js static export
npm run build
npm run export

# Deploy to AWS S3 + CloudFront
aws s3 sync out/ s3://your-bucket/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## Troubleshooting

### Backend won't start
- Check Docker daemon is running
- Verify `.env` variables are set
- Check ports 27017, 6379, 8000 are available
- Review container logs: `docker-compose logs api-gateway`

### Frontend won't start
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)
- Check port 3000 is available

### CORS errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check API Gateway CORS settings in `api_gateway/main.py`

## Environment Variables

### Backend (.env)

```env
MONGODB_URL=mongodb://user:pass@host:27017
MONGODB_DB_NAME=empathy_db
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
ENVIRONMENT=development
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_ENV=development
```

## Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f api-gateway

# Stop services
docker-compose down

# Clean up volumes
docker-compose down -v
```

## CI/CD

See `.github/workflows/` for GitHub Actions configurations.

## Support

For issues, create a GitHub issue or contact the team on Slack.
