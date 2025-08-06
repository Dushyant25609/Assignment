#!/bin/bash

# Setup verification script
echo "🔍 Verifying project setup..."

# Check if Docker is installed
if command -v docker &> /dev/null; then
    echo "✅ Docker is installed"
else
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if docker compose version &> /dev/null || docker-compose version &> /dev/null; then
    echo "✅ Docker Compose is available"
else
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Check if dev.sh is executable
if [ -x "./dev.sh" ]; then
    echo "✅ dev.sh is executable"
else
    echo "❌ dev.sh is not executable. Running: chmod +x dev.sh"
    chmod +x dev.sh
fi

# Check directory structure
echo "📁 Checking project structure..."

REQUIRED_DIRS=(
    "client"
    "server" 
    "docker"
    "client/src"
    "server/src"
    "server/prisma"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ Directory exists: $dir"
    else
        echo "❌ Missing directory: $dir"
    fi
done

# Check required files
echo "📄 Checking required files..."

REQUIRED_FILES=(
    "docker-compose.yml"
    "docker-compose.dev.yml"
    "dev.sh"
    "client/package.json"
    "server/package.json"
    "server/prisma/schema.prisma"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ File exists: $file"
    else
        echo "❌ Missing file: $file"
    fi
done

echo ""
echo "🚀 Setup verification complete!"
echo ""
echo "Next steps:"
echo "1. Run './dev.sh start' to start the development environment"
echo "2. Wait for all services to be ready"
echo "3. Visit http://localhost:3000 for the frontend"
echo "4. Visit http://localhost:5000/api for the backend API"
echo ""
echo "For more commands, run './dev.sh help'"
