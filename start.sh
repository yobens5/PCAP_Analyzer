#!/bin/bash

# NetViz - Startup Script
# This script starts the Flask backend server

echo "🌐 Starting NetViz PCAP Visualization Tool..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found!"
    echo "Please run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Activate virtual environment
echo "✅ Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if ! python -c "import flask" 2>/dev/null; then
    echo "❌ Dependencies not installed!"
    echo "Please run: pip install -r requirements.txt"
    exit 1
fi

# Start Flask server
echo "✅ Starting Flask backend server..."
echo "📡 Backend API: http://localhost:5000"
echo "🌐 Frontend: Open frontend/index.html in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python backend/app.py

# Made with Bob
