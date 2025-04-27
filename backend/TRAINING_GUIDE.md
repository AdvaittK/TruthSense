# Lie Detection Model Training Guide

This comprehensive guide will walk you through the process of creating a dataset, preprocessing videos, and training a custom lie detection model using your own data.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Dataset Preparation](#dataset-preparation)
- [Quick Start](#quick-start)
- [Detailed Training Process](#detailed-training-process)
- [Model Architecture](#model-architecture)
- [Training Parameters](#training-parameters)
- [Evaluating Model Performance](#evaluating-model-performance)
- [Testing Your Model](#testing-your-model)
- [Troubleshooting](#troubleshooting)
- [Advanced Customizations](#advanced-customizations)

## Prerequisites

- **Python 3.8 or newer**
- **PyTorch and its dependencies** (installed automatically via requirements.txt)
- **FFmpeg** installed for audio extraction and processing
- **A dataset of videos** showing both truthful and deceptive statements
- **GPU recommended** for faster training (but not required)
- **8GB+ RAM** (16GB+ recommended for larger datasets)
- **Storage space** for processed data (approximately 3x the size of your raw video dataset)

## Dataset Preparation

### Creating an Effective Dataset

The quality of your dataset will significantly impact model performance. Follow these guidelines:

#### Video Collection Guidelines

1. **Subject Diversity**: Include a variety of people (different ages, genders, ethnicities)
2. **Recording Conditions**: Vary lighting conditions and camera angles (within reason)
3. **Content Variety**: Include different topics and speaking contexts
4. **Balancing**: Aim for a roughly equal number of truth and lie videos

#### Video Requirements

Each video should:
- Be 5-30 seconds long for best results
- Include a clear view of the person's face (front-facing ideal)
- Have good, consistent lighting
- Include clear audio with minimal background noise
- Focus on a single subject (person) speaking
- Be in MP4, AVI, MOV, or MKV format

#### Organizing Your Dataset

Create two main folders:

1. `truth_videos/` - Contains videos of people telling the truth
2. `lie_videos/` - Contains videos of people telling lies

Example structure:
```
dataset_raw/
├── truth_videos/
│   ├── person1_truth_topic1.mp4
│   ├── person2_truth_topic1.mp4
│   └── ...
└── lie_videos/
    ├── person1_lie_topic1.mp4
    ├── person2_lie_topic1.mp4
    └── ...
```

#### Recommended Dataset Size

For good results:
- Minimum: 50+ videos of each class (truth/lie)
- Recommended: 200+ videos of each class
- Ideal: 500+ videos of each class

## Quick Start

The easiest way to train a model is using our batch file:

1. Open a command prompt in the `backend` directory
2. Run `train_model.bat`
3. Follow the prompts to specify the paths to your truth and lie video directories
4. Wait for the preprocessing and training to complete

## Detailed Training Process

If you prefer more control, follow these steps manually:

### 1. Preprocess the Dataset

This step extracts faces from videos and processes audio features:

```bash
python preprocess_dataset.py --truth "path/to/truth_videos" --lie "path/to/lie_videos" --output "dataset"
```

This command:
- Scans through each video, extracting frames at regular intervals
- Detects and extracts faces from each frame
- Processes audio to extract relevant features
- Organizes everything into a structured dataset format

The preprocessing will create:
```
dataset/
├── truth/
│   ├── video1/
│   │   ├── frames/
│   │   │   ├── frame_000.jpg
│   │   │   ├── frame_001.jpg
│   │   │   └── ...
│   │   └── audio_features.npy
│   └── ...
└── fake/
    ├── video1/
    │   ├── frames/
    │   │   ├── frame_000.jpg
    │   │   └── ...
    │   └── audio_features.npy
    └── ...
```

### 2. Train the Model

Once preprocessing is complete, train the model:

```bash
python train_model.py --dataset "dataset" --epochs 20 --batch-size 4 --lr 0.001
```

Parameters:
- `--dataset`: Path to the preprocessed dataset directory (default: "dataset")
- `--epochs`: Number of training iterations (default: 20)
- `--batch-size`: Number of samples per batch (default: 4)
- `--lr`: Learning rate (default: 0.001)

The training script will:
- Load the preprocessed dataset
- Create and configure the CNN-LSTM model
- Train the model for the specified number of epochs
- Save the best model based on validation accuracy
- Generate a final model and metadata

### 3. Use the Trained Model

After training completes, the model will be saved in the `models` directory. The backend server will automatically use this model instead of the dummy model.

To start the backend server with your trained model:
```bash
python -m uvicorn app:app --reload
```

## Model Architecture

Our lie detection model uses a CNN-LSTM architecture specifically designed for video analysis:

### Visual Processing
1. **CNN Feature Extractor**:
   - Convolutional layers to extract spatial features from face frames
   - Processes facial micro-expressions and visual cues
   - Architecture: 4 convolutional blocks with increasing channels (16→32→64→128)

### Temporal Processing
2. **LSTM Sequence Analyzer**:
   - Processes the sequence of facial features over time
   - Captures temporal patterns in expressions
   - 2-layer bidirectional LSTM with 64 hidden units

### Audio Processing
3. **Audio Feature Network**:
   - Processes extracted audio features (MFCC, spectral features)
   - Captures vocal stress patterns and speech characteristics
   - Fully connected layers with dropout for regularization

### Fusion and Classification
4. **Multimodal Fusion**:
   - Combines visual and audio features
   - Final classification layers with dropout for regularization
   - Binary output: Truth vs Lie prediction

## Training Parameters

For optimal training, consider these parameter ranges:

| Parameter | Recommended Range | Notes |
|-----------|-------------------|-------|
| Epochs | 20-50 | More epochs for larger datasets |
| Batch Size | 4-16 | Lower for limited GPU memory |
| Learning Rate | 0.0001-0.001 | Start higher, reduce if training unstable |
| Weight Decay | 1e-5 to 1e-4 | For regularization |

## Evaluating Model Performance

After training, check these metrics to evaluate your model:

1. **Training/Validation Loss**: Should decrease and converge
2. **Accuracy**: Final validation accuracy above 70% is promising
3. **Confusion Matrix**: Check balanced performance between classes

You can find these metrics in the training logs and the model metadata file.

## Testing Your Model

To test your trained model on a new video:

```bash
python test_video.py path/to/video.mp4 --model "models/best_model.pth"
```

This will:
1. Process the video
2. Extract faces and audio features
3. Run the model prediction
4. Display detailed results

## Troubleshooting

### No faces detected
- Ensure videos have clear, front-facing subjects
- Check lighting conditions - avoid extreme shadows or brightness
- Try adjusting the face detection parameters in `video_processor.py`

### Training crashes or out-of-memory errors
- Reduce batch size
- Use a machine with more RAM/GPU memory
- Process videos at lower resolution

### Poor accuracy
- Increase dataset size and diversity
- Ensure good balance between truth and lie classes
- Try data augmentation (see Advanced section)
- Adjust learning rate or try different optimizers

### CUDA/GPU issues
- Verify CUDA is properly installed
- Try training on CPU with `--device cpu` parameter
- Update GPU drivers

## Advanced Customizations

For advanced users who want to improve model performance:

### Model Architecture Adjustments

Edit `model_trainer.py` to:
- Use different CNN architectures (ResNet, EfficientNet)
- Adjust LSTM parameters and layers
- Implement attention mechanisms

### Data Augmentation

Implement augmentation techniques in preprocessing:
- Horizontal flipping
- Small rotations
- Brightness/contrast variations
- Temporal augmentations

### Transfer Learning

For better performance:
- Use pretrained facial recognition models
- Fine-tune with your lie detection dataset
- Implement feature extraction from established models

### Hyperparameter Tuning

Run a grid search or Bayesian optimization over:
- Learning rates
- Model architectures
- Training parameters
