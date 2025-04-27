import argparse
import logging
import os
import json
import cv2
import torch
import numpy as np
from video_processor import VideoProcessor
from predictor import Predictor

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_video(video_path: str, model_path: str = None):
    """
    Test the lie detection model on a single video
    """
    if not os.path.exists(video_path):
        logger.error(f"Video file not found: {video_path}")
        return
    
    # Initialize components
    video_processor = VideoProcessor()
    predictor = Predictor()
    
    # If a specific model path is provided, use it
    if model_path and os.path.exists(model_path):
        # Create a temporary metadata file
        metadata = {
            "model_path": model_path,
            "timestamp": "2023-01-01T00:00:00",
            "accuracy": 85.0  # Placeholder accuracy
        }
        
        temp_metadata_path = os.path.join(os.path.dirname(predictor.model_dir), "models/temp_metadata.json")
        os.makedirs(os.path.dirname(temp_metadata_path), exist_ok=True)
        
        with open(temp_metadata_path, "w") as f:
            json.dump(metadata, f)
        
        # Try to load the specified model
        try:
            predictor._load_model()
            logger.info(f"Loaded model from {model_path}")
        except Exception as e:
            logger.error(f"Error loading model from {model_path}: {str(e)}")
            return
    
    # Process the video
    logger.info(f"Processing video: {video_path}")
    processed_data = video_processor.process_video(video_path)
    
    if not processed_data:
        logger.error("Failed to process video. No faces detected.")
        return
    
    # Make prediction
    prediction = predictor.predict(processed_data)
    
    logger.info("=" * 50)
    logger.info("Prediction Results:")
    logger.info(f"Result: {prediction['prediction']}")
    logger.info(f"Confidence: {prediction['confidence']:.2f}%")
    logger.info("Feature Analysis:")
    for feature, score in prediction['features'].items():
        logger.info(f"- {feature}: {score:.2f}%")
    logger.info("=" * 50)
    
    return prediction

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Test lie detection model on a video")
    parser.add_argument("video", type=str, help="Path to video file")
    parser.add_argument("--model", type=str, help="Path to a specific model file (optional)")
    
    args = parser.parse_args()
    
    test_video(args.video, args.model)
