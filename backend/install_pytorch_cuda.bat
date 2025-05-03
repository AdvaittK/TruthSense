@echo off
echo Installing PyTorch with CUDA support...
echo.

pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

echo.
echo Installation completed. Running CUDA test...
echo.

python test_cuda.py

echo.
echo Test completed. Press any key to exit...
pause > nul
