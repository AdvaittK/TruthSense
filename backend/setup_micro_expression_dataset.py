import os
import shutil
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def setup_dataset():
    """
    Reorganize the Kaggle micro-expression dataset into the proper structure
    for the micro-expression analyzer to use.
    """
    # Base directory paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    archive_dir = os.path.join(base_dir, "micro_expression_dataset", "archive")
    output_dir = os.path.join(base_dir, "micro_expression_dataset")
    
    # Create output directories
    truth_dir = os.path.join(output_dir, "truth")
    lie_dir = os.path.join(output_dir, "lie")
    
    os.makedirs(truth_dir, exist_ok=True)
    os.makedirs(lie_dir, exist_ok=True)
    
    # Source directories (based on the structure we've seen)
    train_truth_dir = os.path.join(archive_dir, "Train", "Train", "Truth")
    train_lie_dir = os.path.join(archive_dir, "Train", "Train", "Lie")
    test_truth_dir = os.path.join(archive_dir, "Test", "Test", "Truth")
    test_lie_dir = os.path.join(archive_dir, "Test", "Test", "Lie")
    
    # Count for statistics
    truth_count = 0
    lie_count = 0
    
    # Function to recursively find and copy all image files
    def process_directory(src_dir, dst_dir, category_prefix, is_truth):
        nonlocal truth_count, lie_count
        
        if not os.path.exists(src_dir):
            logger.warning(f"Directory not found: {src_dir}")
            return
            
        logger.info(f"Processing directory: {src_dir}")
        
        # Get all files in the directory and subdirectories
        for root, dirs, files in os.walk(src_dir):
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
                    # Create a unique filename based on the directory structure
                    rel_path = os.path.relpath(root, src_dir)
                    if rel_path == '.':
                        unique_name = f"{category_prefix}_{file}"
                    else:
                        # Replace directory separators with underscores for the filename
                        path_part = rel_path.replace(os.path.sep, '_')
                        unique_name = f"{category_prefix}_{path_part}_{file}"
                    
                    # Copy the file
                    src_path = os.path.join(root, file)
                    dst_path = os.path.join(dst_dir, unique_name)
                    shutil.copy2(src_path, dst_path)
                    
                    # Update counts
                    if is_truth:
                        truth_count += 1
                    else:
                        lie_count += 1
    
    # Process all directories
    process_directory(train_truth_dir, truth_dir, "train", True)
    process_directory(train_lie_dir, lie_dir, "train", False)
    process_directory(test_truth_dir, truth_dir, "test", True)
    process_directory(test_lie_dir, lie_dir, "test", False)
    
    # Check the result
    if truth_count == 0 or lie_count == 0:
        logger.warning("Failed to find and copy enough images for both categories.")
        logger.warning("Please check the dataset structure and try again.")
        return False
    
    logger.info(f"Setup complete! Copied {truth_count} truth images and {lie_count} lie images.")
    logger.info(f"Truth images are in: {truth_dir}")
    logger.info(f"Lie images are in: {lie_dir}")
    
    return True

if __name__ == "__main__":
    setup_dataset()