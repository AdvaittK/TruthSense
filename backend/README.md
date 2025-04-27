# Lie Detection System - Backend

This directory contains the backend components of the lie detection system.

## Components

- **app.py**: FastAPI main application entry point
- **video_processor.py**: Handles video extraction and preprocessing
- **model_trainer.py**: Contains the ML model training logic
- **predictor.py**: Makes predictions on processed video data

## Directory Structure

```
backend/
├── app.py                # Main FastAPI application
├── model_trainer.py      # ML model training code
├── predictor.py          # Prediction module
├── video_processor.py    # Video processing module
├── config/               # Configuration files
│   ├── Dockerfile        # Docker configuration
│   └── requirements.txt  # Python dependencies
├── models/               # Saved ML models
├── uploads/              # Temporary storage for uploaded videos
└── processed/            # Processed video data
```

## Setup and Installation

1. Install dependencies:
   ```
   pip install -r config/requirements.txt
   ```

2. Run the API server:
   ```
   uvicorn app:app --reload
   ```

3. Docker deployment:
   ```
   docker build -t lie-detection-backend -f config/Dockerfile .
   docker run -p 8000:8000 lie-detection-backend
   ```

## API Endpoints

- `POST /upload`: Upload a video for lie detection analysis
- `GET /results/{video_id}`: Retrieve analysis results
