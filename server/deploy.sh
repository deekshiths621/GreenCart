#!/bin/bash
# Server Deployment Script for Vercel
# This script deploys the Node.js server to Vercel

echo "========================================"
echo "   Deploying Server to Vercel"
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

# Check if we're in the server directory
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found. Are you in the server directory?"
    exit 1
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo "Warning: vercel.json not found. Vercel may not deploy correctly."
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Deploy to production
echo "Deploying server to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "   Server Deployed Successfully!"
    echo "========================================"
    echo ""
    echo "Check your Vercel dashboard for the deployment URL."
    echo ""
    echo "IMPORTANT: Don't forget to set environment variables in Vercel:"
    echo "  - MONGO_URI"
    echo "  - JWT_SECRET"
    echo "  - CLOUDINARY_CLOUD_NAME"
    echo "  - CLOUDINARY_API_KEY"
    echo "  - CLOUDINARY_API_SECRET"
    echo "  - PORT"
else
    echo ""
    echo "========================================"
    echo "   Server Deployment Failed!"
    echo "========================================"
    echo ""
    echo "Please check the error messages above."
    echo "Common issues:"
    echo "  - Missing environment variables in Vercel dashboard"
    echo "  - Incorrect vercel.json configuration"
    echo "  - Login issues (run 'vercel login' first)"
    exit 1
fi
