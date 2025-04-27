import cv2
import numpy as np
import os
import logging
from typing import List, Dict, Any, Optional
import time

logger = logging.getLogger(__name__)

class VideoProcessor:
    def __init__(self):
        """
        Initialize the video processor with face detection model
        """
        # Load face detection model
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Directory for saving processed frames
        self.processed_dir = "processed"
        os.makedirs(self.processed_dir, exist_ok=True)
        
        logger.info("VideoProcessor initialized")
    
    def process_video(self, video_path: str) -> Optional[Dict[str, Any]]:
        """
        Process a video file:
        1. Extract frames at regular intervals
        2. Detect faces in each frame
        3. Extract audio features
        4. Return processed data for model input
        """
        try:
            logger.info(f"Processing video: {video_path}")
            
            # Open the video file
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                logger.error(f"Error opening video file: {video_path}")
                return None
            
            # Get video properties
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = frame_count / fps
            
            logger.info(f"Video properties: {fps} fps, {frame_count} frames, {duration:.2f} seconds")
            
            # Extract frames at regular intervals (1 frame per second)
            frames = []
            face_frames = []
            frame_interval = int(fps)
            
            frame_idx = 0
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                if frame_idx % frame_interval == 0:
                    # Convert to grayscale for face detection
                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                    
                    # Detect faces
                    faces = self.face_cascade.detectMultiScale(
                        gray, 
                        scaleFactor=1.1, 
                        minNeighbors=5,
                        minSize=(30, 30)
                    )
                    
                    # If faces found, save the largest face
                    if len(faces) > 0:
                        # Find the largest face
                        largest_face_idx = np.argmax([w*h for (x, y, w, h) in faces])
                        x, y, w, h = faces[largest_face_idx]
                        
                        # Extract face ROI with some margin
                        margin = 20
                        x_start = max(0, x - margin)
                        y_start = max(0, y - margin)
                        x_end = min(frame.shape[1], x + w + margin)
                        y_end = min(frame.shape[0], y + h + margin)
                        
                        face_roi = frame[y_start:y_end, x_start:x_end]
                        
                        # Resize to standard size for model input
                        face_roi = cv2.resize(face_roi, (224, 224))
                        face_frames.append(face_roi)
                    
                    frames.append(frame)
                
                frame_idx += 1
            
            cap.release()
            
            # Check if we found any faces
            if len(face_frames) == 0:
                logger.warning("No faces detected in the video")
                return None
            
            logger.info(f"Extracted {len(frames)} frames and {len(face_frames)} face frames")
            
            # Extract audio features (in a real implementation, we would use a library like librosa)
            # For this example, we'll simulate audio features
            audio_features = self._extract_audio_features(video_path)
            
            # Prepare the processed data
            processed_data = {
                "face_frames": face_frames,
                "audio_features": audio_features,
                "metadata": {
                    "fps": fps,
                    "duration": duration,
                    "frame_count": frame_count
                }
            }
            
            return processed_data
            
        except Exception as e:
            logger.error(f"Error processing video: {str(e)}")
            return None
    
    def _extract_audio_features(self, video_path: str) -> np.ndarray:
        """
        Extract audio features from the video
        In a real implementation, we would use a library like librosa
        For this example, we'll simulate audio features
        """
        # Simulate audio features (pitch, energy, speaking rate, etc.)
        # In a real implementation, we would extract these from the audio track
        
        # Generate exactly 20 features as expected by the model
        num_features = 20
        
        # Generate a single frame of audio features
        # This ensures compatibility with the model which expects [1, 20] shape
        audio_features = np.random.rand(num_features)
        
        logging.info(f"Generated audio features with shape: {audio_features.shape}")
        
        return audio_features
