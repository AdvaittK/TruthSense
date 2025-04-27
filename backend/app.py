from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import shutil
import uuid
import numpy as np
from typing import Optional, List
import logging
import time

# Import our custom modules
from video_processor import VideoProcessor
from model_trainer import ModelTrainer
from predictor import Predictor

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Lie Detection API")

# Configure CORS - allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Development frontend URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

# Create necessary directories
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "processed")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(PROCESSED_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)

# Initialize our components
video_processor = VideoProcessor()
model_trainer = ModelTrainer()
predictor = Predictor()

class PredictionResult(BaseModel):
    prediction: str
    confidence: float
    features: dict

@app.get("/")
def read_root():
    return {"message": "Lie Detection API is running"}

@app.post("/upload", response_model=PredictionResult)
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """
    Upload a video file and get a lie detection prediction
    """
    try:
        # Generate a unique filename
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        temp_file_path = f"uploads/{file_id}{file_extension}"
        
        # Save the uploaded file
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"Video uploaded: {temp_file_path}")
        
        # Process the video (extract frames, detect faces, etc.)
        processed_data = video_processor.process_video(temp_file_path)
        
        if not processed_data:
            raise HTTPException(status_code=400, detail="Failed to process video. No faces detected.")
        
        # Make prediction using our model
        prediction_result = predictor.predict(processed_data)
        
        # Schedule cleanup in the background
        background_tasks.add_task(cleanup_files, temp_file_path)
        
        return prediction_result
        
    except Exception as e:
        logger.error(f"Error processing upload: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
async def train_model(background_tasks: BackgroundTasks):
    """
    Trigger model retraining with the latest dataset
    """
    try:
        # This would be a long-running task, so we run it in the background
        background_tasks.add_task(model_trainer.train_model)
        
        return {"message": "Model training started in the background"}
    except Exception as e:
        logger.error(f"Error starting model training: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model/status")
def get_model_status():
    """
    Get the current model status and training metrics
    """
    # Log the model info before returning
    logger.info(f"Model status requested: loaded={predictor.model_loaded}, " 
                f"version={predictor.model_version}, accuracy={predictor.accuracy}")
    
    return {
        "model_loaded": predictor.model_loaded,
        "last_trained": predictor.last_trained,
        "accuracy": predictor.accuracy,
        "version": predictor.model_version
    }

def cleanup_files(file_path: str):
    """
    Clean up temporary files after processing
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Cleaned up file: {file_path}")
    except Exception as e:
        logger.error(f"Error cleaning up file {file_path}: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)