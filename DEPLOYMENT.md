# Deployment Guide for Lie Detection System

This guide outlines how to deploy the Lie Detection System to production environments.

## System Requirements

- **CPU**: 4+ cores recommended (8+ preferred for faster processing)
- **RAM**: Minimum 8GB (16GB+ recommended)
- **Storage**: At least 10GB free space
- **GPU**: NVIDIA GPU with CUDA support recommended for faster processing
- **OS**: Ubuntu 20.04 LTS or newer (Linux recommended), Windows Server 2019+

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites

- Docker and Docker Compose installed
- Git installed

#### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lie-detection-system.git
   cd lie-detection-system
   ```

2. Build and start the containers:
   ```bash
   docker-compose up -d --build
   ```

3. Access the application at `http://your-server-ip:3000`

### Option 2: Manual Deployment

#### Backend Deployment

1. Set up a Python environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   cd backend
   pip install -r config/requirements.txt
   ```

3. Set up environment variables:
   ```bash
   export PORT=8000
   export HOST=0.0.0.0
   export MODEL_PATH=/path/to/models
   ```

4. Run the backend server with Gunicorn:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:8000
   ```

#### Frontend Deployment

1. Install Node.js dependencies:
   ```bash
   pnpm install
   ```

2. Build the production version:
   ```bash
   pnpm build
   ```

3. Start the production server:
   ```bash
   pnpm start
   ```

4. Alternatively, use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start pnpm --name "lie-detection" -- start
   ```

### Option 3: Cloud Deployment

#### AWS Deployment

1. **Backend**:
   - Deploy as a Docker container on ECS or EC2
   - Use ECR to store Docker images
   - Set up an Application Load Balancer

2. **Frontend**:
   - Build and deploy to S3 + CloudFront for static hosting
   - Alternatively, use Amplify for Next.js deployment

3. **Database** (if needed for future expansions):
   - Use RDS for relational data
   - DynamoDB for non-relational data

#### Azure Deployment

1. **Backend**:
   - Deploy to Azure App Service
   - Use Azure Container Instances or AKS for container deployment

2. **Frontend**:
   - Deploy to Azure Static Web Apps
   - Or use Azure App Service for full Next.js support

## Security Considerations

1. **API Security**:
   - Set up proper CORS configuration
   - Use API keys or JWT authentication for production
   - Rate limit the API endpoints

2. **Data Security**:
   - Ensure uploaded videos are stored securely
   - Consider encryption for sensitive data
   - Implement proper access controls

3. **Network Security**:
   - Use HTTPS for all connections
   - Configure firewalls to restrict access
   - Consider using a WAF (Web Application Firewall)

## Scaling Considerations

1. **Horizontal Scaling**:
   - The backend can be scaled horizontally for handling multiple requests
   - Use load balancers to distribute traffic

2. **Vertical Scaling**:
   - For better model performance, consider using machines with stronger GPUs
   - Increase RAM for handling larger videos

## Monitoring and Maintenance

1. **Logging**:
   - Set up centralized logging with ELK stack or similar
   - Monitor model performance and accuracy

2. **Performance Monitoring**:
   - Track API response times
   - Monitor resource usage (CPU, GPU, memory)
   - Set up alerts for abnormal patterns

3. **Regular Updates**:
   - Keep dependencies updated
   - Retrain models periodically with new data

## Troubleshooting Common Issues

1. **Model Loading Errors**:
   - Check if model files exist at specified paths
   - Verify CUDA availability for GPU-accelerated inference

2. **Video Processing Issues**:
   - Check if OpenCV is properly installed
   - Verify face detection is working properly

3. **API Connection Problems**:
   - Check network configurations
   - Verify CORS settings match your deployment domains

## Contact and Support

For questions or support, contact:
- Email: support@liedetection.example.com
- GitHub Issues: [Create an issue](https://github.com/yourusername/lie-detection-system/issues)
