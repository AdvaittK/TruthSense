@echo off
echo Starting Lie Detection System...

:: Start the backend server in a new terminal window
start powershell.exe -NoExit -Command "cd 'C:\Users\advai\Downloads\lie detection new\backend' ; python -m uvicorn app:app --reload --port 8000"

:: Wait a moment for the backend to start
timeout /t 3 > nul

:: Start the frontend development server
cd "C:\Users\advai\Downloads\lie detection new"
pnpm dev
