import torch
import sys

print(f"Python version: {sys.version}")
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")

if torch.cuda.is_available():
    print(f"CUDA device count: {torch.cuda.device_count()}")
    print(f"Current CUDA device: {torch.cuda.current_device()}")
    print(f"CUDA device name: {torch.cuda.get_device_name(torch.cuda.current_device())}")
    
    # Test CUDA functionality
    print("\nRunning a small test on CUDA...")
    x = torch.rand(5, 3).cuda()
    print(f"Tensor on CUDA: {x.device}")
    y = x + x
    print("CUDA operation completed successfully!")
else:
    print("CUDA is not available. Please check your installation.")
