# Lie Detection System - Development Guide

This document provides guidance for continuing the development of the Lie Detection System application.

## Architecture Overview

The application consists of two main parts:

1. **Frontend (Next.js)**
   - Uses React 19 and Next.js App Router
   - Styled with Tailwind CSS and shadcn/ui components
   - Located in the root directory with components in `/components`
   - API client in `/lib/api.ts`

2. **Backend (FastAPI)**
   - Python-based API server
   - Located in the `/backend` directory
   - Main entry point is `app.py`
   - ML model components in `predictor.py` and `model_trainer.py`
   - Video processing in `video_processor.py`

## Key Directories

- `/app` - Next.js app router components
- `/components` - React components
- `/lib` - Utility functions and API client
- `/backend` - Python FastAPI server
  - `/backend/models` - Saved ML models
  - `/backend/uploads` - Temporary video storage
  - `/backend/processed` - Processed video data
  - `/backend/config` - Configuration files

## Running the Application

### Windows
```bash
start-app.bat
```

### Linux/macOS
```bash
chmod +x start-app.sh
./start-app.sh
```

### Manual Start
```bash
# Start backend
cd backend
python -m uvicorn app:app --reload --port 8000

# Start frontend (in another terminal)
cd ..
pnpm dev
```

## Development Workflow

1. **Frontend Changes**
   - React components are in `/components`
   - Main page is in `/app/page.tsx`
   - API calls should use functions from `/lib/api.ts`

2. **Backend Changes**
   - Update Python code in the `/backend` directory
   - The FastAPI server will auto-reload when changes are detected

3. **Connecting Frontend to Backend**
   - The frontend connects to the backend API at `http://localhost:8000`
   - This is configured in `.env.local`
   - For production, update the `NEXT_PUBLIC_API_URL` environment variable

## Future Improvements

1. **Authentication**
   - Add user authentication for accessing the application
   - Implement JWT-based auth for API requests

2. **Improved ML Model**
   - Enhance the machine learning model for better accuracy
   - Add more features for detection (e.g., vocal stress analysis)

3. **Result Storage**
   - Add a database to store analysis results
   - Create a history page to view past analyses

4. **Deployment**
   - Create a comprehensive Docker Compose setup for easier deployment
   - Add CI/CD pipeline for automated testing and deployment

5. **Monitoring**
   - Add error tracking and performance monitoring
   - Implement logging for easier debugging

## Best Practices

1. **State Management**
   - For complex state, consider using React Context or a more robust state management solution
   
2. **API Requests**
   - All API calls should go through the API client in `/lib/api.ts`
   - Handle errors appropriately with user-friendly messages
   
3. **ML Model Development**
   - Keep models in `/backend/models`
   - Use version control for model iterations
   - Document model parameters and accuracy metrics

4. **Security**
   - Validate all inputs on the server side
   - Implement proper CORS configuration for production
   - Use environment variables for sensitive configuration
