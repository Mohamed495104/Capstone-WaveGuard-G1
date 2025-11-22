#!/bin/bash

# WaveGuard Backend - DigitalOcean Deployment Helper Script
# This script helps you deploy/update your backend on DigitalOcean

set -e  # Exit on error

echo "🌊 WaveGuard Backend - DigitalOcean Deployment Helper"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo -e "${RED}Error: Not a git repository${NC}"
    echo "This script must be run from within a git repository"
    exit 1
fi

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must run this script from the backend directory${NC}"
    echo "Usage: cd backend && ./deploy-digitalocean.sh"
    exit 1
fi

echo "Select deployment option:"
echo ""
echo "1) Test Docker build locally (recommended first step)"
echo "2) Deploy to DigitalOcean App Platform (via Git push)"
echo "3) Build and test with Docker Compose"
echo "4) Show deployment status commands"
echo "5) Exit"
echo ""
read -p "Enter your choice [1-5]: " choice

case $choice in
    1)
        echo -e "${YELLOW}Building Docker image locally...${NC}"
        docker build -t waveguard-backend:test .
        
        echo -e "${GREEN}✓ Build successful!${NC}"
        echo ""
        echo "To run locally with Docker:"
        echo "  docker run -p 5000:5000 --env-file .env waveguard-backend:test"
        echo ""
        echo "To test health endpoint:"
        echo "  curl http://localhost:5000/health"
        ;;
    
    2)
        echo -e "${YELLOW}Deploying to DigitalOcean App Platform...${NC}"
        echo ""
        echo "This will:"
        echo "1. Commit any pending changes"
        echo "2. Push to main branch"
        echo "3. Trigger auto-deployment on DigitalOcean"
        echo ""
        read -p "Continue? (y/n): " confirm
        
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            # Check git status
            if [[ -n $(git status -s) ]]; then
                echo -e "${YELLOW}Uncommitted changes found.${NC}"
                git status -s
                echo ""
                read -p "Enter commit message: " commit_msg
                
                git add .
                git commit -m "$commit_msg"
            else
                echo -e "${GREEN}No uncommitted changes.${NC}"
            fi
            
            echo -e "${YELLOW}Pushing to main branch...${NC}"
            if ! git push origin main; then
                echo -e "${RED}Error: Failed to push to remote repository${NC}"
                echo "Please check your git configuration and try again"
                exit 1
            fi
            
            echo -e "${GREEN}✓ Pushed to GitHub!${NC}"
            echo ""
            echo "DigitalOcean will automatically deploy your changes."
            echo "Check deployment status in your DigitalOcean dashboard:"
            echo "  https://cloud.digitalocean.com/apps"
            echo ""
            echo "Deployment usually takes 3-5 minutes."
        else
            echo "Deployment cancelled."
        fi
        ;;
    
    3)
        echo -e "${YELLOW}Building and starting with Docker Compose...${NC}"
        
        if [ ! -f ".env" ]; then
            echo -e "${RED}Error: .env file not found${NC}"
            echo "Copy .env.example to .env and fill in your values:"
            echo "  cp .env.example .env"
            echo "  nano .env"
            exit 1
        fi
        
        docker-compose down
        docker-compose up -d --build
        
        echo -e "${GREEN}✓ Docker Compose started!${NC}"
        echo ""
        echo "View logs:"
        echo "  docker-compose logs -f"
        echo ""
        echo "Test health endpoint:"
        echo "  curl http://localhost:5000/health"
        echo ""
        echo "Stop containers:"
        echo "  docker-compose down"
        ;;
    
    4)
        echo -e "${GREEN}Useful Commands:${NC}"
        echo ""
        echo "📊 Check DigitalOcean App Status:"
        echo "  Visit: https://cloud.digitalocean.com/apps"
        echo ""
        echo "📝 View Runtime Logs:"
        echo "  Dashboard → Your App → Runtime Logs tab"
        echo ""
        echo "🔄 Force Rebuild:"
        echo "  Dashboard → Your App → Settings → Force Rebuild and Deploy"
        echo ""
        echo "🐳 Local Docker Commands:"
        echo "  Build:   docker build -t waveguard-backend ."
        echo "  Run:     docker run -p 5000:5000 --env-file .env waveguard-backend"
        echo "  Logs:    docker logs <container-id>"
        echo "  Stop:    docker stop <container-id>"
        echo "  Clean:   docker system prune -a"
        echo ""
        echo "📦 Docker Compose Commands:"
        echo "  Start:   docker-compose up -d"
        echo "  Stop:    docker-compose down"
        echo "  Logs:    docker-compose logs -f"
        echo "  Rebuild: docker-compose up -d --build"
        echo ""
        echo "🌐 Test Endpoints:"
        echo "  Local:   curl http://localhost:5000/health"
        echo "  Remote:  curl https://your-app.ondigitalocean.app/health"
        ;;
    
    5)
        echo "Exiting..."
        exit 0
        ;;
    
    *)
        echo -e "${RED}Invalid option${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
