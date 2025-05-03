@echo off
REM Lie Detection System Startup Script

echo ===================================================
echo Lie Detection System Startup
echo ===================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Python not found. Please install Python 3.8 or newer.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js not found. Please install Node.js v18 or newer.
    pause
    exit /b 1
)

echo Starting backend server...
start cmd /k "cd backend && python simple_app.py "

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo Starting frontend development server...
start cmd /k "pnpm dev"

echo.
echo ===================================================
echo Lie Detection System is starting up!
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to shut down all servers...
echo ===================================================

pause

echo.
echo Shutting down servers...
echo.

REM Kill the Python process running uvicorn
taskkill /f /im python.exe /fi "WINDOWTITLE eq *uvicorn*" >nul 2>&1
taskkill /f /im node.exe /fi "WINDOWTITLE eq *next*" >nul 2>&1

echo System shut down complete.
echo Thank you for using the Lie Detection System.
pause
