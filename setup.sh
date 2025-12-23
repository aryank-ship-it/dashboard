#!/bin/bash

echo "🚀 Dashboard Setup Script"
echo "========================="
echo ""

# Check if MongoDB is installed or running in Docker
if docker ps --format '{{.Names}}' | grep -q 'dashboard-mongodb'; then
    echo "✅ MongoDB is running in Docker"
elif pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running locally"
elif command -v docker &> /dev/null; then
    echo "🐳 Docker detected. Starting MongoDB in a container..."
    docker run -d --name dashboard-mongodb -p 27017:27017 -v dashboard_mongo_data:/data/db mongo:latest
    echo "✅ MongoDB started in Docker"
elif command -v mongod &> /dev/null; then
    echo "Starting local MongoDB..."
    # Try to start MongoDB
    if command -v systemctl &> /dev/null; then
        sudo systemctl start mongodb || sudo systemctl start mongod
    else
        echo "❌ Could not start MongoDB automatically"
        echo "Please start MongoDB manually"
    fi
else
    echo "❌ MongoDB is not installed"
    echo ""
    echo "Please install MongoDB:"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install -y mongodb"
    echo ""
    echo "macOS:"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community"
    echo ""
    echo "Or use MongoDB Atlas (cloud):"
    echo "  https://www.mongodb.com/cloud/atlas"
    echo ""
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  npm start"
echo ""
echo "Then:"
echo "  1. Open http://localhost:5173"
echo "  2. Register a new account"
echo "  3. Make yourself admin (see README.md)"
echo ""
