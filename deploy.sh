#!/bin/bash

# Solar Estimator - Production Deployment Script
# MasterviewCEL Energy Solutions

echo "🌞 Solar System Estimator - Deployment Script"
echo "=============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 18 or higher from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version $NODE_VERSION is too old${NC}"
    echo "Please upgrade to Node.js 18 or higher"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"
echo ""

# Function to install dependencies
install_dependencies() {
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    
    # Frontend dependencies
    echo "Installing frontend packages..."
    npm install
    
    # Backend dependencies
    echo "Installing backend packages..."
    cd backend
    npm install
    cd ..
    
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    echo ""
}

# Function to build frontend
build_frontend() {
    echo -e "${YELLOW}🔨 Building frontend for production...${NC}"
    npm run build
    
    if [ -d "dist" ]; then
        echo -e "${GREEN}✓ Frontend built successfully${NC}"
        echo "Build artifacts located in: ./dist/"
    else
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
    echo ""
}

# Function to start development servers
start_dev() {
    echo -e "${YELLOW}🚀 Starting development servers...${NC}"
    echo ""
    echo "Backend will run on: http://localhost:5050"
    echo "Frontend will run on: http://localhost:5173"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
    echo ""
    
    # Start backend in background
    cd backend
    node index.js &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 2
    
    # Start frontend
    npm run dev &
    FRONTEND_PID=$!
    
    # Wait for both processes
    wait $BACKEND_PID $FRONTEND_PID
}

# Function to start production server
start_prod() {
    echo -e "${YELLOW}🚀 Starting production server...${NC}"
    
    # Set production environment
    export NODE_ENV=production
    export PORT=5050
    
    echo "Starting backend API on port 5050..."
    cd backend
    node index.js &
    BACKEND_PID=$!
    
    echo -e "${GREEN}✓ Backend running (PID: $BACKEND_PID)${NC}"
    echo ""
    echo "Serve the ./dist folder using any static file server:"
    echo "  - npx serve dist -p 3000"
    echo "  - Or deploy to Vercel, Netlify, etc."
    echo ""
    
    wait $BACKEND_PID
}

# Function to run tests
run_tests() {
    echo -e "${YELLOW}🧪 Running tests...${NC}"
    echo "Test suite coming soon..."
    echo ""
}

# Main menu
show_menu() {
    echo "What would you like to do?"
    echo ""
    echo "1) Install dependencies"
    echo "2) Build for production"
    echo "3) Start development servers"
    echo "4) Start production server"
    echo "5) Run tests"
    echo "6) Full setup (install + build)"
    echo "7) Exit"
    echo ""
}

# Parse command line arguments
if [ "$1" == "install" ]; then
    install_dependencies
elif [ "$1" == "build" ]; then
    build_frontend
elif [ "$1" == "dev" ]; then
    start_dev
elif [ "$1" == "prod" ]; then
    start_prod
elif [ "$1" == "test" ]; then
    run_tests
elif [ "$1" == "setup" ]; then
    install_dependencies
    build_frontend
    echo -e "${GREEN}✅ Setup complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run './deploy.sh dev' to start development"
    echo "  2. Or run './deploy.sh prod' for production"
else
    # Interactive mode
    while true; do
        show_menu
        read -p "Enter your choice [1-7]: " choice
        echo ""
        
        case $choice in
            1)
                install_dependencies
                ;;
            2)
                build_frontend
                ;;
            3)
                start_dev
                ;;
            4)
                start_prod
                ;;
            5)
                run_tests
                ;;
            6)
                install_dependencies
                build_frontend
                echo -e "${GREEN}✅ Full setup complete!${NC}"
                ;;
            7)
                echo "Goodbye! ⚡"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid choice. Please try again.${NC}"
                echo ""
                ;;
        esac
    done
fi
