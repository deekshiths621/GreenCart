#!/bin/bash
# Client Deployment Script for Vercel
# This script deploys the React client to Vercel

echo "========================================"
echo "   Deploying Client to Vercel"
echo "========================================"
echo ""

# Check if Vercel CLI is installed
echo "Checking Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "Vercel CLI installed successfully!"
    echo ""
fi

# Check if we're in the client directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Are you in the client directory?"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Build the client
echo "Building client..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful! Deploying to Vercel..."
    echo ""
    
    # Deploy to production
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "========================================"
        echo "   Client Deployed Successfully!"
        echo "========================================"
        echo ""
        echo "Check your Vercel dashboard for the deployment URL."
    else
        echo ""
        echo "========================================"
        echo "   Client Deployment Failed!"
        echo "========================================"
        echo ""
        echo "Please check the error messages above."
        exit 1
    fi
else
    echo ""
    echo "========================================"
    echo "   Build Failed!"
    echo "========================================"
    echo ""
    echo "Please fix the build errors and try again."
    exit 1
fi
