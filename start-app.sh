#!/bin/bash

echo "Starting Lie Detection System..."

# Start the backend server in a new terminal
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd $(pwd)/backend && python -m uvicorn app:app --reload --port 8000"
elif command -v open &> /dev/null; then
    # For macOS
    osascript -e "tell app \"Terminal\" to do script \"cd $(pwd)/backend && python -m uvicorn app:app --reload --port 8000\""
else
    # Use a basic background process if no terminal launcher is found
    echo "Starting backend in background..."
    cd backend && python -m uvicorn app:app --reload --port 8000 &
    cd ..
fi

# Wait a moment for the backend to start
sleep 3

# Start the frontend development server
echo "Starting frontend..."
pnpm dev
