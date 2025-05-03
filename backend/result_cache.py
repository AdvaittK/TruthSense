import os
import json
import hashlib
import logging
from typing import Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class ResultCache:
    """
    A persistent cache to store and retrieve video analysis results
    to ensure consistency when the same video is uploaded multiple times.
    """
    def __init__(self, cache_dir="cache"):
        """
        Initialize the result cache
        
        Args:
            cache_dir: Directory to store cache files
        """
        self.cache_dir = cache_dir
        self.cache_file = os.path.join(cache_dir, "prediction_cache.json")
        
        # Create cache directory if it doesn't exist
        os.makedirs(cache_dir, exist_ok=True)
        
        # Load cache from disk or create empty cache
        self.cache = self._load_cache()
        
        logger.info(f"Result cache initialized with {len(self.cache)} entries")
    
    def _load_cache(self) -> Dict[str, Any]:
        """Load cache from disk if it exists"""
        if os.path.exists(self.cache_file):
            try:
                with open(self.cache_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading cache: {str(e)}")
                return {}
        else:
            return {}
    
    def _save_cache(self):
        """Save cache to disk"""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump(self.cache, f, indent=2)
        except Exception as e:
            logger.error(f"Error saving cache: {str(e)}")
    
    def compute_video_hash(self, video_data: bytes) -> str:
        """
        Compute a hash for a video file to be used as a unique identifier
        
        Args:
            video_data: Binary data of the video file
            
        Returns:
            A hex string hash representing the video
        """
        return hashlib.sha256(video_data).hexdigest()
    
    def get_result(self, video_hash: str) -> Optional[Dict[str, Any]]:
        """
        Get a cached result for a video if it exists
        
        Args:
            video_hash: Hash of the video
            
        Returns:
            Cached result or None if not found
        """
        if video_hash in self.cache:
            logger.info(f"Cache hit for video: {video_hash[:8]}...")
            return self.cache[video_hash]["result"]
        
        logger.info(f"Cache miss for video: {video_hash[:8]}...")
        return None
    
    def store_result(self, video_hash: str, result: Dict[str, Any]):
        """
        Store a result in the cache
        
        Args:
            video_hash: Hash of the video
            result: Prediction result to cache
        """
        self.cache[video_hash] = {
            "result": result,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save cache to disk
        self._save_cache()
        
        logger.info(f"Stored result in cache for video: {video_hash[:8]}...")

    def clear_cache(self):
        """Clear the entire cache"""
        self.cache = {}
        self._save_cache()
        logger.info("Cache cleared")