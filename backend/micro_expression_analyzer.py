import os
import cv2
import numpy as np
import logging
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path

logger = logging.getLogger(__name__)

class MicroExpressionAnalyzer:
    """
    Analyzer for facial micro-expressions using pre-existing datasets
    to detect truth/lie patterns in facial expressions.
    """
    def __init__(self, dataset_dir: str = "micro_expression_dataset"):
        """
        Initialize the micro-expression analyzer with the reference dataset
        
        Args:
            dataset_dir: Directory containing the micro-expression dataset
        """
        self.dataset_dir = dataset_dir
        self.truth_expressions = []
        self.lie_expressions = []
        self.dataset_loaded = False
        
        # Load dataset if available
        if os.path.exists(dataset_dir):
            self.load_dataset()
        else:
            logger.warning(f"Micro-expression dataset not found at {dataset_dir}")
    
    def load_dataset(self):
        """
        Load the micro-expression dataset from the specified directory
        Expected structure:
        - dataset_dir/
          - truth/
            - image1.jpg
            - image2.jpg
            ...
          - lie/
            - image1.jpg
            - image2.jpg
            ...
        """
        truth_dir = os.path.join(self.dataset_dir, "truth")
        lie_dir = os.path.join(self.dataset_dir, "lie")
        
        # Check if dataset directories exist
        if not os.path.exists(truth_dir) or not os.path.exists(lie_dir):
            logger.warning(f"Dataset structure not found in {self.dataset_dir}")
            return False
        
        # Load truth expressions
        try:
            self.truth_expressions = []
            for img_file in os.listdir(truth_dir):
                if not img_file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    continue
                    
                img_path = os.path.join(truth_dir, img_file)
                img = cv2.imread(img_path)
                if img is not None:
                    # Resize for consistency
                    img = cv2.resize(img, (224, 224))
                    # Convert to grayscale for feature comparison
                    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    self.truth_expressions.append({"image": img, "features": self._extract_features(gray)})
            
            # Load lie expressions
            self.lie_expressions = []
            for img_file in os.listdir(lie_dir):
                if not img_file.lower().endswith(('.png', '.jpg', '.jpeg')):
                    continue
                    
                img_path = os.path.join(lie_dir, img_file)
                img = cv2.imread(img_path)
                if img is not None:
                    # Resize for consistency
                    img = cv2.resize(img, (224, 224))
                    # Convert to grayscale for feature comparison
                    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    self.lie_expressions.append({"image": img, "features": self._extract_features(gray)})
            
            logger.info(f"Loaded {len(self.truth_expressions)} truth expressions and {len(self.lie_expressions)} lie expressions")
            self.dataset_loaded = len(self.truth_expressions) > 0 and len(self.lie_expressions) > 0
            return self.dataset_loaded
            
        except Exception as e:
            logger.error(f"Error loading micro-expression dataset: {str(e)}")
            return False
    
    def _extract_features(self, gray_image):
        """
        Extract facial features from a grayscale image
        
        Args:
            gray_image: Grayscale image of a face
            
        Returns:
            Dictionary of facial features
        """
        # Extract HOG (Histogram of Oriented Gradients) features
        winSize = (224, 224)
        blockSize = (16, 16)
        blockStride = (8, 8)
        cellSize = (8, 8)
        nbins = 9
        
        hog = cv2.HOGDescriptor(winSize, blockSize, blockStride, cellSize, nbins)
        hog_features = hog.compute(gray_image)
        
        # Extract LBP (Local Binary Pattern) features for texture analysis
        # This could be useful for skin texture changes during deception
        radius = 1
        n_points = 8 * radius
        lbp = self._local_binary_pattern(gray_image, n_points, radius)
        lbp_hist, _ = np.histogram(lbp.ravel(), bins=np.arange(0, n_points + 3), range=(0, n_points + 2))
        lbp_hist = lbp_hist.astype("float")
        lbp_hist /= (lbp_hist.sum() + 1e-7)
        
        return {
            "hog": hog_features,
            "lbp": lbp_hist
        }
    
    def _local_binary_pattern(self, image, n_points, radius):
        """
        Compute local binary pattern for facial texture analysis
        """
        # Simple LBP implementation
        lbp = np.zeros_like(image)
        for i in range(radius, image.shape[0] - radius):
            for j in range(radius, image.shape[1] - radius):
                center = image[i, j]
                binary_code = 0
                
                # Compare with neighbors
                if image[i - radius, j - radius] >= center:
                    binary_code += 1
                if image[i - radius, j] >= center:
                    binary_code += 2
                if image[i - radius, j + radius] >= center:
                    binary_code += 4
                if image[i, j + radius] >= center:
                    binary_code += 8
                if image[i + radius, j + radius] >= center:
                    binary_code += 16
                if image[i + radius, j] >= center:
                    binary_code += 32
                if image[i + radius, j - radius] >= center:
                    binary_code += 64
                if image[i, j - radius] >= center:
                    binary_code += 128
                
                lbp[i, j] = binary_code
        
        return lbp
    
    def analyze_frame(self, face_frame) -> Tuple[str, float]:
        """
        Analyze a single facial frame and determine if it shows truth or lie
        
        Args:
            face_frame: BGR image of a face
            
        Returns:
            Tuple of (prediction, confidence)
        """
        if not self.dataset_loaded:
            logger.warning("Dataset not loaded, cannot analyze frame")
            return "unknown", 0.5
        
        # Resize for consistency
        face_frame = cv2.resize(face_frame, (224, 224))
        # Convert to grayscale for feature extraction
        gray = cv2.cvtColor(face_frame, cv2.COLOR_BGR2GRAY)
        # Extract features
        features = self._extract_features(gray)
        
        # Compare with truth expressions
        truth_similarities = []
        for expr in self.truth_expressions:
            similarity = self._compute_similarity(features, expr["features"])
            truth_similarities.append(similarity)
        
        # Compare with lie expressions
        lie_similarities = []
        for expr in self.lie_expressions:
            similarity = self._compute_similarity(features, expr["features"])
            lie_similarities.append(similarity)
        
        # Calculate average similarities
        avg_truth_similarity = np.mean(truth_similarities) if truth_similarities else 0
        avg_lie_similarity = np.mean(lie_similarities) if lie_similarities else 0
        
        # Determine prediction based on similarity
        total_similarity = avg_truth_similarity + avg_lie_similarity
        if total_similarity == 0:
            return "unknown", 0.5
        
        truth_confidence = avg_truth_similarity / total_similarity
        
        if truth_confidence > 0.5:
            return "truth", truth_confidence
        else:
            return "lie", 1.0 - truth_confidence
    
    def _compute_similarity(self, features1, features2):
        """
        Compute similarity between two sets of facial features
        
        Args:
            features1: First set of features
            features2: Second set of features
            
        Returns:
            Similarity score (higher means more similar)
        """
        # HOG similarity using cosine similarity
        hog1 = features1["hog"].flatten()
        hog2 = features2["hog"].flatten()
        hog_similarity = np.dot(hog1, hog2) / (np.linalg.norm(hog1) * np.linalg.norm(hog2) + 1e-7)
        
        # LBP histogram similarity using chi-squared distance
        lbp1 = features1["lbp"]
        lbp2 = features2["lbp"]
        lbp_distance = self._chi2_distance(lbp1, lbp2)
        lbp_similarity = 1.0 / (1.0 + lbp_distance)
        
        # Weighted combination (HOG is generally more discriminative)
        similarity = 0.7 * hog_similarity + 0.3 * lbp_similarity
        
        return similarity
    
    def _chi2_distance(self, hist1, hist2):
        """
        Calculate chi-squared distance between two histograms
        """
        chi = 0
        for i in range(len(hist1)):
            if hist1[i] + hist2[i] > 0:
                chi += ((hist1[i] - hist2[i]) ** 2) / (hist1[i] + hist2[i])
        return chi
    
    def analyze_video_frames(self, face_frames: List[np.ndarray]) -> Dict[str, Any]:
        """
        Analyze multiple facial frames from a video
        
        Args:
            face_frames: List of BGR images of faces
            
        Returns:
            Dictionary with prediction results
        """
        if not face_frames:
            return {
                "prediction": "unknown",
                "confidence": 0.0,
                "truth_score": 0.0,
                "lie_score": 0.0
            }
        
        # Analyze individual frames
        frame_results = []
        for frame in face_frames:
            prediction, confidence = self.analyze_frame(frame)
            frame_results.append((prediction, confidence))
        
        # Count predictions
        truth_count = sum(1 for res in frame_results if res[0] == "truth")
        lie_count = sum(1 for res in frame_results if res[0] == "lie")
        
        # Get average confidences
        truth_confidences = [conf for pred, conf in frame_results if pred == "truth"]
        lie_confidences = [conf for pred, conf in frame_results if pred == "lie"]
        
        avg_truth_confidence = np.mean(truth_confidences) if truth_confidences else 0
        avg_lie_confidence = np.mean(lie_confidences) if lie_confidences else 0
        
        # Final prediction based on majority vote and confidence
        if truth_count > lie_count:
            prediction = "truth"
            confidence = avg_truth_confidence
        elif lie_count > truth_count:
            prediction = "lie"
            confidence = avg_lie_confidence
        else:
            # If tie, use the one with higher confidence
            if avg_truth_confidence >= avg_lie_confidence:
                prediction = "truth"
                confidence = avg_truth_confidence
            else:
                prediction = "lie"
                confidence = avg_lie_confidence
        
        # Calculate scores as percentages
        total_frames = len(face_frames)
        truth_score = (truth_count / total_frames) * 100
        lie_score = (lie_count / total_frames) * 100
        
        return {
            "prediction": prediction,
            "confidence": confidence * 100,  # Convert to percentage
            "truth_score": truth_score,
            "lie_score": lie_score,
            "frame_results": frame_results
        }