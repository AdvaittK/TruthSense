import os
import shutil
import argparse
import logging
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def organize_dataset(source_dir, output_dir="micro_expression_dataset"):
    """
    Organize the Kaggle micro-expression dataset into truth and lie categories
    
    Args:
        source_dir: Directory containing the downloaded dataset
        output_dir: Directory to save the organized dataset
    
    The Kaggle dataset structure is expected to have subdirectories like:
    - truth/
    - lie/ or fake/
    
    Or alternatively, it might have expressions or other categorizations.
    """
    logger.info(f"Organizing micro-expression dataset from {source_dir} to {output_dir}")
    
    # Create output directories
    truth_dir = os.path.join(output_dir, "truth")
    lie_dir = os.path.join(output_dir, "lie")
    
    os.makedirs(truth_dir, exist_ok=True)
    os.makedirs(lie_dir, exist_ok=True)
    
    # Count for statistics
    truth_count = 0
    lie_count = 0
    skipped = 0
    
    # Try to detect dataset structure
    items = os.listdir(source_dir)
    
    # Case 1: Dataset already has truth/lie structure
    if "truth" in items or "Truth" in items:
        truth_folder = "truth" if "truth" in items else "Truth"
        truth_path = os.path.join(source_dir, truth_folder)
        
        for file in os.listdir(truth_path):
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                src_path = os.path.join(truth_path, file)
                dst_path = os.path.join(truth_dir, file)
                shutil.copy2(src_path, dst_path)
                truth_count += 1
    
        # Look for lie/fake folder
        lie_folder = None
        for folder_name in ["lie", "Lie", "fake", "Fake", "deceptive", "Deceptive"]:
            if folder_name in items:
                lie_folder = folder_name
                break
                
        if lie_folder:
            lie_path = os.path.join(source_dir, lie_folder)
            
            for file in os.listdir(lie_path):
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    src_path = os.path.join(lie_path, file)
                    dst_path = os.path.join(lie_dir, file)
                    shutil.copy2(src_path, dst_path)
                    lie_count += 1
    
    # Case 2: Dataset might have expressions categorized by type
    # If no truth/lie structure found, try to look for expression types that can be mapped
    elif not (truth_count or lie_count):
        logger.info("No direct truth/lie folders found. Looking for micro-expression categories...")
        
        # Define which expression categories typically indicate truth or lie
        # This is a simplification - in reality, this mapping is more complex
        truth_expressions = ["happiness", "happy", "neutral", "surprise", "surprised"]
        lie_expressions = ["fear", "anger", "angry", "contempt", "disgust", "sadness", "sad"]
        
        # Check each subdirectory in the dataset
        for item in items:
            item_path = os.path.join(source_dir, item)
            
            if os.path.isdir(item_path):
                expression_category = item.lower()
                target_dir = None
                
                # Map to truth or lie
                if any(expr in expression_category for expr in truth_expressions):
                    target_dir = truth_dir
                    counter = "truth_count"
                elif any(expr in expression_category for expr in lie_expressions):
                    target_dir = lie_dir
                    counter = "lie_count"
                
                if target_dir:
                    # Copy all images from this expression category
                    for file in os.listdir(item_path):
                        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                            src_path = os.path.join(item_path, file)
                            dst_path = os.path.join(target_dir, f"{expression_category}_{file}")
                            shutil.copy2(src_path, dst_path)
                            
                            if counter == "truth_count":
                                truth_count += 1
                            else:
                                lie_count += 1
                else:
                    logger.warning(f"Skipping folder {item} - could not map to truth/lie category")
    
    # Case 3: Flat directory with images
    if not (truth_count or lie_count):
        logger.info("No organized structure found. Looking for images with truth/lie indicators in filenames...")
        
        # Look for image files with truth/lie indicators in the name
        for file in items:
            if not file.lower().endswith(('.jpg', '.jpeg', '.png')):
                continue
                
            file_lower = file.lower()
            if any(term in file_lower for term in ["truth", "honest", "true"]):
                dst_path = os.path.join(truth_dir, file)
                shutil.copy2(os.path.join(source_dir, file), dst_path)
                truth_count += 1
            elif any(term in file_lower for term in ["lie", "fake", "deceptive", "false"]):
                dst_path = os.path.join(lie_dir, file)
                shutil.copy2(os.path.join(source_dir, file), dst_path)
                lie_count += 1
            else:
                skipped += 1
    
    # Check if we have enough images
    if truth_count == 0 or lie_count == 0:
        logger.warning("Could not find enough images for both truth and lie categories.")
        logger.warning("Please review the dataset structure and organize it manually.")
        return False
    
    logger.info(f"Dataset organization complete. Copied {truth_count} truth images and {lie_count} lie images.")
    logger.info(f"Skipped {skipped} images that couldn't be categorized.")
    
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Organize Kaggle micro-expression dataset")
    parser.add_argument("--source", type=str, required=True, help="Directory containing the downloaded dataset")
    parser.add_argument("--output", type=str, default="micro_expression_dataset", help="Output directory for organized dataset")
    
    args = parser.parse_args()
    organize_dataset(args.source, args.output)