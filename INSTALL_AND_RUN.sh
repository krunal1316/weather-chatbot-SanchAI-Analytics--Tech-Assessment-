#!/bin/bash
# Installation and Run Script for Weather App

echo "=== Weather App Setup ==="
echo ""

# Step 1: Backend Setup
echo "Step 1: Setting up backend..."
cd backend

# Check if venv exists, create if not
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/Scripts/activate

# Upgrade pip first
echo "Upgrading pip..."
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org --upgrade pip

# Install requirements
echo "Installing Python packages..."
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "⚠️  IMPORTANT: Create a .env file in the backend folder with:"
    echo "OPENROUTER_API_KEY=your_key_here"
    echo "OPENWEATHER_API_KEY=your_key_here"
    echo ""
    read -p "Press Enter after you've created the .env file..."
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "To start the backend server, run:"
echo "  cd backend"
echo "  source venv/Scripts/activate"
echo "  uvicorn main:app --reload --port 8000"
echo ""
echo "Then in a NEW terminal, run the frontend:"
echo "  cd frontend"
echo "  npm install"
echo "  npm start"

