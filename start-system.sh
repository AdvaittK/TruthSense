#!/bin/bash
# Lie Detection System Startup Script

echo "==================================================="
echo "Lie Detection System Startup"
echo "==================================================="
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python not found. Please install Python 3.8 or newer."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js not found. Please install Node.js v18 or newer."
    exit 1
fi

# Function to cleanly stop processes on exit
function cleanup() {
    echo
    echo "Shutting down servers..."
    
    # Kill the backend process
    if [ -n "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    
    # Kill the frontend process
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    echo "System shut down complete."
    echo "Thank you for using the Lie Detection System."
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT

echo "Starting backend server..."
cd backend && python3 -m uvicorn app:app --reload &
BACKEND_PID=$!

echo "Waiting for backend to initialize..."
sleep 5

echo "Starting frontend development server..."
cd .. && pnpm dev &
FRONTEND_PID=$!

echo
echo "==================================================="
echo "Lie Detection System is starting up!"
echo
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to shut down all servers..."
echo "==================================================="

# Keep script running
wait $BACKEND_PID $FRONTEND_PID
