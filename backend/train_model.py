import os
import argparse
import logging
import torch
from model_trainer import ModelTrainer

# Set up logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def train_model(dataset_dir: str = "dataset", epochs: int = 20, batch_size: int = 4, learning_rate: float = 0.001):
    """
    Train the lie detection model using the preprocessed dataset
    """
    # Create trainer instance
    trainer = ModelTrainer()
    
    # Override default parameters
    trainer.data_dir = dataset_dir
    trainer.num_epochs = epochs
    trainer.batch_size = batch_size
    trainer.learning_rate = learning_rate
    
    # Check if CUDA is available and update device
    if torch.cuda.is_available():
        logger.info("CUDA is available, using GPU for training")
        trainer.device = torch.device("cuda")
    else:
        logger.info("CUDA not available, using CPU for training")
        trainer.device = torch.device("cpu")
    
    # Check if dataset exists
    if not os.path.exists(dataset_dir):
        logger.error(f"Dataset directory not found: {dataset_dir}")
        logger.info("Please run preprocess_dataset.py first to create the dataset.")
        return False
    
    # Check if dataset has truth and fake videos
    truth_dir = os.path.join(dataset_dir, "truth")
    fake_dir = os.path.join(dataset_dir, "fake")
    
    if not os.path.exists(truth_dir) or not os.path.exists(fake_dir):
        logger.error("Dataset structure is incorrect. Make sure it has 'truth' and 'fake' subdirectories.")
        return False
    
    truth_count = len(os.listdir(truth_dir))
    fake_count = len(os.listdir(fake_dir))
    
    if truth_count == 0 or fake_count == 0:
        logger.error(f"One of the classes has no samples. Truth: {truth_count}, Fake: {fake_count}")
        return False
    
    logger.info(f"Dataset statistics: Truth videos: {truth_count}, Fake videos: {fake_count}")
    
    # Train the model
    logger.info(f"Starting training with {epochs} epochs, batch size: {batch_size}, learning rate: {learning_rate}")
    success = trainer.train_model()
    
    if success:
        logger.info("Training completed successfully")
    else:
        logger.error("Training failed")
    
    return success

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train lie detection model")
    parser.add_argument("--dataset", type=str, default="dataset", help="Path to preprocessed dataset directory")
    parser.add_argument("--epochs", type=int, default=20, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=4, help="Batch size for training")
    parser.add_argument("--lr", type=float, default=0.001, help="Learning rate for training")
    
    args = parser.parse_args()
    
    train_model(args.dataset, args.epochs, args.batch_size, args.lr)
