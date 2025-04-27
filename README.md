# Lie Detection System with CNN-LSTM

A machine learning-based lie detection system that analyzes facial micro-expressions, voice patterns, and subtle body language cues to detect deception.



## Features

- **Video Analysis**: Upload videos to analyze for signs of deception
- **CNN-LSTM Model**: Deep learning model trained to detect subtle cues of deception
- **Real-time Processing**: Quick processing of uploaded video content
- **Feature Breakdown**: Detailed analysis of facial expressions, voice patterns, and micro gestures
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS

## Technology Stack

### Frontend
- **Next.js**: React framework for production applications
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Shadcn UI**: Component library for beautiful UI elements

### Backend
- **FastAPI**: Modern, fast API framework for Python
- **PyTorch**: Deep learning framework for neural networks
- **OpenCV**: Computer vision library for video and image processing
- **Librosa**: Audio processing for speech analysis
- **Docker**: Containerization for easy deployment

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python 3.8+
- CUDA-compatible GPU recommended (for faster model training)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lie-detection-system.git
   cd lie-detection-system
   ```

2. Install frontend dependencies:
   ```bash
   pnpm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   pip install -r config/requirements.txt
   cd ..
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   python -m uvicorn app:app --reload
   ```

2. Start the frontend development server:
   ```bash
   pnpm dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Training a Custom Model

To train a custom lie detection model using your own dataset:

1. Organize your videos into truth and lie directories
2. Run the training script:
   ```bash
   cd backend
   python train_model.py --dataset "your_dataset" --epochs 20
   ```

For detailed training instructions, see [TRAINING_GUIDE.md](backend/TRAINING_GUIDE.md)

## Usage

1. Upload a video of someone speaking
2. Wait for the analysis to complete
3. View the detailed breakdown of truth/deception indicators
4. Check the feature analysis for specific cues that led to the conclusion

## Development

For development guidelines, see [DEVELOPMENT.md](DEVELOPMENT.md)

## Scientific Basis

This system is based on research in:
- Facial micro-expression analysis
- Voice stress analysis
- Non-verbal behavioral cues
- Machine learning approaches to deception detection

Our CNN-LSTM model achieves 67% accuracy on detection tasks. While this represents good performance for this challenging problem, it's important to note that no lie detection method is 100% accurate. Results should be interpreted with appropriate context and caution.

## License

[MIT License](LICENSE)

## Acknowledgements

- [PyTorch](https://pytorch.org/) for the deep learning framework
- [Next.js](https://nextjs.org/) for the frontend framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend API
- [OpenCV](https://opencv.org/) for computer vision capabilities
