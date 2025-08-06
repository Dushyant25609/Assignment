#!/bin/bash

# Development script for managing the application
# Usage: ./dev.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}======================================${NC}"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Development start
dev_start() {
    print_header "Starting Development Environment"
    check_docker
    
    print_status "Building and starting development containers..."
    docker-compose -f docker-compose.dev.yml up --build -d
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    print_status "Development environment is ready!"
    echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
    echo -e "${GREEN}Backend API:${NC} http://localhost:5001"
    echo -e "${GREEN}MongoDB:${NC} mongodb://admin:password123@localhost:27017"
    
    print_status "To view logs, run: ./dev.sh logs"
    print_status "To stop, run: ./dev.sh stop"
}

# Development stop
dev_stop() {
    print_header "Stopping Development Environment"
    docker-compose -f docker-compose.dev.yml down
    print_status "Development environment stopped!"
}

# Production start
prod_start() {
    print_header "Starting Production Environment"
    check_docker
    
    print_status "Building and starting production containers..."
    docker-compose up --build -d
    
    print_status "Waiting for services to be ready..."
    sleep 15
    
    print_status "Production environment is ready!"
    echo -e "${GREEN}Application:${NC} http://localhost"
    echo -e "${GREEN}API Direct:${NC} http://localhost:5000"
    echo -e "${GREEN}Frontend Direct:${NC} http://localhost:3000"
}

# Production stop
prod_stop() {
    print_header "Stopping Production Environment"
    docker-compose down
    print_status "Production environment stopped!"
}

# View logs
view_logs() {
    if [ "$2" == "dev" ]; then
        docker-compose -f docker-compose.dev.yml logs -f $3
    else
        docker-compose logs -f $2
    fi
}

# Clean up everything
cleanup() {
    print_header "Cleaning Up Docker Resources"
    print_warning "This will remove all containers, images, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose -f docker-compose.dev.yml down -v --rmi all
        docker-compose down -v --rmi all
        docker system prune -f
        print_status "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Database operations
db_seed() {
    print_header "Seeding Database"
    if [ "$2" == "dev" ]; then
        docker-compose -f docker-compose.dev.yml exec server npm run db:seed
    else
        docker-compose exec server npm run db:seed
    fi
}

db_reset() {
    print_header "Resetting Database"
    print_warning "This will delete all data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ "$2" == "dev" ]; then
            docker-compose -f docker-compose.dev.yml exec server npm run db:reset
        else
            docker-compose exec server npm run db:reset
        fi
        print_status "Database reset completed!"
    else
        print_status "Database reset cancelled."
    fi
}

# Install dependencies
install_deps() {
    print_header "Installing Dependencies"
    
    print_status "Installing server dependencies..."
    cd server && npm install && cd ..
    
    print_status "Installing client dependencies..."
    cd client && npm install && cd ..
    
    print_status "Dependencies installed!"
}

# Git operations
git_pull() {
    print_header "Pulling Latest Changes"
    git pull origin main
    install_deps
    print_status "Latest changes pulled and dependencies updated!"
}

git_push() {
    print_header "Pushing Changes"
    if [ -z "$2" ]; then
        print_error "Please provide a commit message: ./dev.sh push \"Your message\""
        exit 1
    fi
    
    git add .
    git commit -m "$2"
    git push origin main
    print_status "Changes pushed successfully!"
}

# Status check
status() {
    print_header "System Status"
    
    print_status "Docker containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    
    echo ""
    print_status "Docker volumes:"
    docker volume ls --filter name=assignment
    
    echo ""
    print_status "Network status:"
    docker network ls --filter name=assignment
}

# Help function
show_help() {
    echo -e "${BLUE}Assignment Project Development Script${NC}"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start              Start development environment"
    echo "  stop               Stop development environment"
    echo "  restart            Restart development environment"
    echo "  prod-start         Start production environment"
    echo "  prod-stop          Stop production environment"
    echo "  logs [service]     View logs (optional: specify service)"
    echo "  logs dev [service] View development logs"
    echo "  status             Show system status"
    echo "  cleanup            Clean up all Docker resources"
    echo "  install            Install dependencies"
    echo "  pull               Pull latest changes from git"
    echo "  push \"message\"      Commit and push changes"
    echo "  db:seed [dev]      Seed database (add 'dev' for development)"
    echo "  db:reset [dev]     Reset database (add 'dev' for development)"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start           # Start development environment"
    echo "  $0 logs server     # View server logs"
    echo "  $0 logs dev client # View client logs in development"
    echo "  $0 push \"Fix bug\"   # Commit and push changes"
}

# Main command handler
case "$1" in
    "start"|"dev")
        dev_start
        ;;
    "stop")
        dev_stop
        ;;
    "restart")
        dev_stop
        sleep 2
        dev_start
        ;;
    "prod-start"|"production")
        prod_start
        ;;
    "prod-stop")
        prod_stop
        ;;
    "logs")
        view_logs $@
        ;;
    "status")
        status
        ;;
    "cleanup")
        cleanup
        ;;
    "install")
        install_deps
        ;;
    "pull")
        git_pull
        ;;
    "push")
        git_push $@
        ;;
    "db:seed")
        db_seed $@
        ;;
    "db:reset")
        db_reset $@
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    "")
        print_error "No command provided"
        show_help
        exit 1
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
