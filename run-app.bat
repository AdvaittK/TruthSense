@echo off
echo Starting Lie Detection Application...
echo.

REM Create an .env.local file to ensure frontend connects to backend
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
echo Created .env.local with API URL

echo Starting the backend API...
start powershell -NoExit -Command "cd backend; python -m uvicorn app:app --reload --port 8000"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo Starting the frontend...
start powershell -NoExit -Command "pnpm dev"

echo.
echo Application is starting! Please wait a moment...
echo.
echo Backend API: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo NOTE: Application is using the trained model with 67% accuracy
