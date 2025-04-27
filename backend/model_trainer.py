import os
import numpy as np
import logging
import time
from datetime import datetime
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from typing import Dict, List, Tuple, Any
import cv2
import json

logger = logging.getLogger(__name__)

# Define a simple CNN + LSTM model for video classification
class LieDetectionModel(nn.Module):
    def __init__(self, num_classes=2):
        super(LieDetectionModel, self).__init__()
        
        # CNN for feature extraction from frames
        self.cnn = nn.Sequential(
            nn.Conv2d(3, 16, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            nn.Conv2d(16, 32, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),
            
            nn.AdaptiveAvgPool2d((1, 1))
        )
        
        # LSTM for temporal sequence modeling
        self.lstm = nn.LSTM(
            input_size=128,
            hidden_size=64,
            num_layers=2,
            batch_first=True,
            dropout=0.2
        )
        
        # Audio feature processing
        self.audio_fc = nn.Sequential(
            nn.Linear(20, 32),
            nn.ReLU(),
            nn.Dropout(0.2)
        )
        
        # Fusion and classification
        self.classifier = nn.Sequential(
            nn.Linear(64 + 32, 32),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(32, num_classes)
        )
    
    def forward(self, frames, audio_features):
        batch_size, seq_len, c, h, w = frames.shape
        
        # Process each frame with CNN
        cnn_features = []
        for t in range(seq_len):
            frame_features = self.cnn(frames[:, t])  # (batch, 128, 1, 1)
            frame_features = frame_features.squeeze(-1).squeeze(-1)  # (batch, 128)
            cnn_features.append(frame_features)
        
        # Stack features for LSTM
        cnn_features = torch.stack(cnn_features, dim=1)  # (batch, seq_len, 128)
        
        # Process with LSTM
        lstm_out, _ = self.lstm(cnn_features)  # (batch, seq_len, 64)
        lstm_features = lstm_out[:, -1, :]  # Take the last output
        
        # Process audio features
        audio_features = self.audio_fc(audio_features)  # (batch, 32)
        
        # Concatenate visual and audio features
        combined_features = torch.cat([lstm_features, audio_features], dim=1)
        
        # Classification
        output = self.classifier(combined_features)
        
        return output

class VideoDataset(Dataset):
    def __init__(self, data_dir, transform=None):
        self.data_dir = data_dir
        self.transform = transform
        self.samples = self._load_samples()
    
    def _load_samples(self):
        """
        Load sample paths and labels from the dataset directory
        Structure:
        - data_dir/
          - truth/
            - video1/
              - frames/
              - audio_features.npy
            - video2/
              ...
          - fake/
            - video1/
              ...
        """
        samples = []
        
        # Process truth videos
        truth_dir = os.path.join(self.data_dir, "truth")
        if os.path.exists(truth_dir):
            for video_dir in os.listdir(truth_dir):
                video_path = os.path.join(truth_dir, video_dir)
                if os.path.isdir(video_path):
                    frames_dir = os.path.join(video_path, "frames")
                    audio_file = os.path.join(video_path, "audio_features.npy")
                    
                    if os.path.exists(frames_dir) and os.path.exists(audio_file):
                        samples.append({
                            "frames_dir": frames_dir,
                            "audio_file": audio_file,
                            "label": 1  # 1 for truth
                        })
        
        # Process fake videos
        fake_dir = os.path.join(self.data_dir, "fake")
        if os.path.exists(fake_dir):
            for video_dir in os.listdir(fake_dir):
                video_path = os.path.join(fake_dir, video_dir)
                if os.path.isdir(video_path):
                    frames_dir = os.path.join(video_path, "frames")
                    audio_file = os.path.join(video_path, "audio_features.npy")
                    
                    if os.path.exists(frames_dir) and os.path.exists(audio_file):
                        samples.append({
                            "frames_dir": frames_dir,
                            "audio_file": audio_file,
                            "label": 0  # 0 for fake
                        })
        
        return samples
    
    def __len__(self):
        return len(self.samples)
    
    def __getitem__(self, idx):
        sample = self.samples[idx]
        
        # Load frames
        frames_dir = sample["frames_dir"]
        frame_files = sorted([f for f in os.listdir(frames_dir) if f.endswith('.jpg')])
        
        # Limit to 30 frames max
        frame_files = frame_files[:30]
        
        frames = []
        for frame_file in frame_files:
            frame_path = os.path.join(frames_dir, frame_file)
            frame = cv2.imread(frame_path)
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            if self.transform:
                frame = self.transform(frame)
            else:
                # Basic preprocessing
                frame = cv2.resize(frame, (224, 224))
                frame = frame / 255.0
                frame = np.transpose(frame, (2, 0, 1))  # (H, W, C) -> (C, H, W)
                frame = torch.from_numpy(frame).float()
            
            frames.append(frame)
        
        # Pad if needed
        if len(frames) < 30:
            # Create empty frames for padding
            empty_frame = torch.zeros_like(frames[0])
            frames.extend([empty_frame] * (30 - len(frames)))
        
        # Stack frames
        frames = torch.stack(frames)
        
        # Load audio features
        audio_features = np.load(sample["audio_file"])
        audio_features = torch.from_numpy(audio_features).float()
        
        # Get label
        label = sample["label"]
        label = torch.tensor(label, dtype=torch.long)
        
        return frames, audio_features, label

class ModelTrainer:
    def __init__(self):
        """
        Initialize the model trainer
        """
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_dir = "models"
        self.data_dir = "dataset"
        self.batch_size = 4
        self.num_epochs = 10
        self.learning_rate = 0.001
        
        # Create model directory if it doesn't exist
        os.makedirs(self.model_dir, exist_ok=True)
        
        logger.info(f"ModelTrainer initialized (device: {self.device})")
    
    def train_model(self):
        """
        Train the lie detection model using the dataset
        """
        try:
            logger.info("Starting model training...")
            
            # Check if dataset exists
            if not os.path.exists(self.data_dir):
                logger.error(f"Dataset directory not found: {self.data_dir}")
                return False
            
            # Create dataset and data loader
            train_dataset = VideoDataset(self.data_dir)
            train_loader = DataLoader(
                train_dataset, 
                batch_size=self.batch_size, 
                shuffle=True,
                num_workers=2
            )
            
            logger.info(f"Dataset loaded with {len(train_dataset)} samples")
            
            # Initialize model
            model = LieDetectionModel()
            model = model.to(self.device)
            
            # Loss function and optimizer
            criterion = nn.CrossEntropyLoss()
            optimizer = optim.Adam(model.parameters(), lr=self.learning_rate)
            
            # Training loop
            start_time = time.time()
            best_accuracy = 0.0
            
            for epoch in range(self.num_epochs):
                model.train()
                running_loss = 0.0
                correct = 0
                total = 0
                
                for frames, audio_features, labels in train_loader:
                    # Move data to device
                    frames = frames.to(self.device)
                    audio_features = audio_features.to(self.device)
                    labels = labels.to(self.device)
                    
                    # Zero the parameter gradients
                    optimizer.zero_grad()
                    
                    # Forward pass
                    outputs = model(frames, audio_features)
                    loss = criterion(outputs, labels)
                    
                    # Backward pass and optimize
                    loss.backward()
                    optimizer.step()
                    
                    # Statistics
                    running_loss += loss.item()
                    _, predicted = torch.max(outputs.data, 1)
                    total += labels.size(0)
                    correct += (predicted == labels).sum().item()
                
                # Calculate epoch statistics
                epoch_loss = running_loss / len(train_loader)
                epoch_accuracy = 100 * correct / total
                
                logger.info(f"Epoch {epoch+1}/{self.num_epochs}, Loss: {epoch_loss:.4f}, Accuracy: {epoch_accuracy:.2f}%")
                
                # Save the best model
                if epoch_accuracy > best_accuracy:
                    best_accuracy = epoch_accuracy
                    model_path = os.path.join(self.model_dir, "best_model.pth")
                    torch.save(model.state_dict(), model_path)
                    logger.info(f"Saved best model with accuracy: {best_accuracy:.2f}%")
            
            # Save the final model
            final_model_path = os.path.join(self.model_dir, f"model_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pth")
            torch.save(model.state_dict(), final_model_path)
            
            # Save model metadata
            metadata = {
                "accuracy": best_accuracy,
                "training_time": time.time() - start_time,
                "epochs": self.num_epochs,
                "timestamp": datetime.now().isoformat(),
                "model_path": final_model_path
            }
            
            with open(os.path.join(self.model_dir, "model_metadata.json"), "w") as f:
                json.dump(metadata, f, indent=4)
            
            logger.info(f"Model training completed in {time.time() - start_time:.2f} seconds")
            logger.info(f"Best accuracy: {best_accuracy:.2f}%")
            
            return True
            
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            return False