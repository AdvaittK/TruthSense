import os
import cv2
import numpy as np
from typing import List, Dict, Any
import argparse
import shutil
import logging
from tqdm import tqdm
import librosa
import soundfile as sf

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class VideoPreprocessor:
    def __init__(self, output_dir: str = "dataset"):
        """
        Initialize the video preprocessor to create a training dataset
        """
        self.output_dir = output_dir
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Create output directory structure
        self.truth_dir = os.path.join(output_dir, "truth")
        self.fake_dir = os.path.join(output_dir, "fake")
        
        os.makedirs(self.truth_dir, exist_ok=True)
        os.makedirs(self.fake_dir, exist_ok=True)
        
        logger.info(f"VideoPreprocessor initialized with output directory: {output_dir}")
    
    def process_video(self, video_path: str, is_truth: bool, max_frames: int = 30) -> str:
        """
        Process a single video and save the extracted frames and audio features
        
        Args:
            video_path: Path to the video file
            is_truth: Whether the video contains truth (True) or lies (False)
            max_frames: Maximum number of face frames to extract
            
        Returns:
            Path to the processed video directory
        """
        try:
            # Generate a unique ID for the video
            video_id = os.path.splitext(os.path.basename(video_path))[0]
            
            # Determine output directory
            output_category_dir = self.truth_dir if is_truth else self.fake_dir
            video_output_dir = os.path.join(output_category_dir, video_id)
            frames_dir = os.path.join(video_output_dir, "frames")
            
            # Create directories
            os.makedirs(frames_dir, exist_ok=True)
            
            # Open the video file
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                logger.error(f"Error opening video file: {video_path}")
                return None
            
            # Get video properties
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            duration = frame_count / fps
            
            logger.info(f"Processing {video_path}: {fps} fps, {frame_count} frames, {duration:.2f} seconds")
            
            # Extract frames at regular intervals
            frame_interval = max(1, int(frame_count / max_frames))
            extracted_faces = 0
            frame_idx = 0
            
            # Process frames
            while cap.isOpened() and extracted_faces < max_frames:
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
                        
                        # Resize to standard size
                        face_roi = cv2.resize(face_roi, (224, 224))
                        
                        # Save the face frame
                        face_path = os.path.join(frames_dir, f"frame_{extracted_faces:03d}.jpg")
                        cv2.imwrite(face_path, face_roi)
                        
                        extracted_faces += 1
                
                frame_idx += 1
            
            cap.release()
            
            # Extract audio features
            audio_features = self._extract_audio_features(video_path)
            audio_path = os.path.join(video_output_dir, "audio_features.npy")
            np.save(audio_path, audio_features)
            
            logger.info(f"Processed {video_path}: extracted {extracted_faces} face frames")
            
            # If we couldn't extract any faces, return None
            if extracted_faces == 0:
                logger.warning(f"No faces detected in {video_path}")
                shutil.rmtree(video_output_dir)  # Clean up
                return None
            
            return video_output_dir
            
        except Exception as e:
            logger.error(f"Error processing video {video_path}: {str(e)}")
            return None
    
    def _extract_audio_features(self, video_path: str) -> np.ndarray:
        """
        Extract audio features from the video using librosa
        """
        try:
            # Extract audio to a temporary file
            temp_audio_path = os.path.splitext(video_path)[0] + "_temp_audio.wav"
            
            # Use FFmpeg to extract audio (requires ffmpeg installed)
            ffmpeg_cmd = f"ffmpeg -i \"{video_path}\" -q:a 0 -map a \"{temp_audio_path}\" -y"
            result = os.system(ffmpeg_cmd)
            
            # Check if ffmpeg was successful
            if result != 0 or not os.path.exists(temp_audio_path):
                logger.warning(f"Failed to extract audio from {video_path} using ffmpeg. Generating random features.")
                return np.random.rand(20)  # Return random features as a fallback
            
            # Load audio file
            y, sr = librosa.load(temp_audio_path, sr=None)
            
            # Extract features
            # Mel-frequency cepstral coefficients
            mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
            mfcc_mean = np.mean(mfccs, axis=1)
            
            # Spectral centroid
            centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
            centroid_mean = np.mean(centroid, axis=1)
            
            # Spectral rolloff
            rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
            rolloff_mean = np.mean(rolloff, axis=1)
            
            # Spectral contrast
            contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
            contrast_mean = np.mean(contrast, axis=1)
            
            # Combine features
            features = np.concatenate([
                mfcc_mean,
                centroid_mean,
                rolloff_mean,
                contrast_mean.flatten()[:5]  # Limit to keep feature vector size consistent
            ])
            
            # Clean up temp file
            os.remove(temp_audio_path)
            
            # Ensure we have exactly 20 features
            if len(features) > 20:
                features = features[:20]
            elif len(features) < 20:
                features = np.pad(features, (0, 20 - len(features)))
            
            return features
            
        except Exception as e:
            logger.warning(f"Error extracting audio features: {str(e)}. Using random features.")
            return np.random.rand(20)  # Return random features as a fallback

def preprocess_dataset(truth_videos_dir: str, lie_videos_dir: str, output_dir: str = "dataset"):
    """
    Preprocess all videos in the truth and lie directories
    """
    preprocessor = VideoPreprocessor(output_dir)
    
    # Process truth videos
    if os.path.exists(truth_videos_dir):
        video_files = [f for f in os.listdir(truth_videos_dir) 
                      if f.endswith(('.mp4', '.avi', '.mov', '.mkv'))]
        
        logger.info(f"Found {len(video_files)} truth videos. Processing...")
        for video_file in tqdm(video_files):
            video_path = os.path.join(truth_videos_dir, video_file)
            preprocessor.process_video(video_path, is_truth=True)
    else:
        logger.warning(f"Truth videos directory not found: {truth_videos_dir}")
    
    # Process lie videos
    if os.path.exists(lie_videos_dir):
        video_files = [f for f in os.listdir(lie_videos_dir) 
                      if f.endswith(('.mp4', '.avi', '.mov', '.mkv'))]
        
        logger.info(f"Found {len(video_files)} lie videos. Processing...")
        for video_file in tqdm(video_files):
            video_path = os.path.join(lie_videos_dir, video_file)
            preprocessor.process_video(video_path, is_truth=False)
    else:
        logger.warning(f"Lie videos directory not found: {lie_videos_dir}")
    
    # Check if we have enough data
    truth_videos = len(os.listdir(os.path.join(output_dir, "truth")))
    lie_videos = len(os.listdir(os.path.join(output_dir, "fake")))
    
    logger.info(f"Dataset creation complete. Processed {truth_videos} truth videos and {lie_videos} lie videos.")
    
    if truth_videos == 0 or lie_videos == 0:
        logger.warning("Warning: One of the classes has no samples. The model may not train properly.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Preprocess video dataset for lie detection")
    parser.add_argument("--truth", type=str, required=True, help="Directory containing truth videos")
    parser.add_argument("--lie", type=str, required=True, help="Directory containing lie videos")
    parser.add_argument("--output", type=str, default="dataset", help="Output directory for processed dataset")
    
    args = parser.parse_args()
    
    preprocess_dataset(args.truth, args.lie, args.output)
