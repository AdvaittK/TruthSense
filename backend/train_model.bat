@echo off
REM Lie Detection Model Training Script

echo ===================================================
echo Lie Detection Model Training Wizard
echo ===================================================
echo.
echo This script will guide you through the process of training
echo a lie detection model using your truth and lie videos.
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python not found. Please install Python 3.8 or newer.
    pause
    exit /b 1
)

REM Check if dataset directories exist
set DATA_DIR=%CD%\dataset
if not exist %DATA_DIR% (
    mkdir %DATA_DIR%
    echo Created dataset directory.
)

echo Please specify the paths to your video directories:
echo.

:GET_TRUTH_DIR
set /p TRUTH_DIR="Path to directory containing truth videos: "
if not exist "%TRUTH_DIR%" (
    echo Error: Directory not found. Please enter a valid path.
    goto GET_TRUTH_DIR
)

:GET_LIE_DIR
set /p LIE_DIR="Path to directory containing lie videos: "
if not exist "%LIE_DIR%" (
    echo Error: Directory not found. Please enter a valid path.
    goto GET_LIE_DIR
)

echo.
echo ===================================================
echo Installing required packages...
echo ===================================================
pip install -r config\requirements.txt

echo.
echo ===================================================
echo Preprocessing videos...
echo ===================================================
python preprocess_dataset.py --truth "%TRUTH_DIR%" --lie "%LIE_DIR%" --output "%DATA_DIR%"

echo.
echo ===================================================
echo Training the model...
echo ===================================================
python train_model.py --dataset "%DATA_DIR%" --epochs 20 --batch-size 4

echo.
echo ===================================================
echo Training complete!
echo ===================================================
echo.
echo The trained model has been saved to the 'models' directory.
echo You can now run the backend server to use your trained model.
echo.
echo To start the backend server, run:
echo python -m uvicorn app:app --reload
echo.
pause
