# Lie Detection System - Setup Summary

This document provides a quick overview of the system and how to get started.

## System Overview

The Lie Detection System is an AI-powered application that analyzes videos for signs of deception using:
- Facial micro-expression analysis
- Voice pattern analysis
- Body language detection

The system combines these features with a CNN-LSTM neural network to provide truth/deception predictions with confidence scores.

## Project Structure

- **Frontend**: Next.js application with TypeScript and Tailwind CSS
- **Backend**: FastAPI server with PyTorch-based machine learning models
- **Models**: CNN-LSTM architecture for video and audio analysis

## Quick Start Guide

### Starting the System

#### Windows:
```
.\start-system.bat
```

#### Linux/macOS:
```
chmod +x ./start-system.sh
./start-system.sh
```

The system will be available at [http://localhost:3000](http://localhost:3000)

### Using the Application

1. **Upload a Video**: Use the upload button to select a video for analysis
2. **View Results**: The system will process the video and display:
   - Truth/Deception prediction
   - Confidence score
   - Feature analysis breakdown
3. **Analyze Features**: View detailed analysis of facial expressions, voice patterns, and micro gestures

## Training Your Own Model

The default system uses a demo mode that simulates results. To train a real model:

1. Navigate to the `backend` directory
2. Run the training script:
```
cd backend
.\train_model.bat
```
3. Follow the prompts to specify your dataset
4. Wait for the training to complete

See [backend/TRAINING_GUIDE.md](backend/TRAINING_GUIDE.md) for detailed instructions.

## Documentation Index

- [README.md](README.md) - Main project documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guidelines
- [backend/TRAINING_GUIDE.md](backend/TRAINING_GUIDE.md) - Model training guide
- [backend/README.md](backend/README.md) - Backend-specific documentation

## Troubleshooting

### Common Issues

1. **Backend server not connecting**:
   - Check if Python dependencies are installed
   - Verify port 8000 is not in use
   - Check logs for Python errors

2. **Frontend issues**:
   - Make sure Node.js and pnpm are installed
   - Check if port 3000 is available
   - Run `pnpm install` if dependencies are missing

3. **Upload problems**:
   - Verify the video format is supported (MP4, AVI, MOV, MKV)
   - Check if the backend upload directory is writable
   - Ensure the video contains clear faces

For more advanced troubleshooting, refer to the appropriate documentation sections.

## Next Steps

- Train a custom model with your own dataset
- Explore the feature analysis tools
- Read about the machine learning approach in the documentation

## Contact and Support

For questions, issues, or feature requests, please create an issue on GitHub or contact the project maintainers.
