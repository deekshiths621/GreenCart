#!/bin/bash
# Deployment Script for Vercel (Bash)
# This script deploys both client and server to Vercel

echo "========================================"
echo "   Deploying Grocery Project to Vercel"
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

# Deploy Client
echo "========================================"
echo "   Step 1: Deploying Client (React)"
echo "========================================"
echo ""

cd client

echo "Building client..."
npm run build

if [ $? -eq 0 ]; then
    echo "Build successful! Deploying to Vercel..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "Client deployed successfully!"
    else
        echo "Client deployment failed!"
        cd ..
        exit 1
    fi
else
    echo "Build failed! Please fix errors and try again."
    cd ..
    exit 1
fi

cd ..

echo ""
echo "========================================"
echo "   Step 2: Deploying Server (Node.js)"
echo "========================================"
echo ""

cd server

echo "Deploying server to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "Server deployed successfully!"
else
    echo "Server deployment failed!"
    cd ..
    exit 1
fi

cd ..

echo ""
echo "========================================"
echo "   Deployment Complete!"
echo "========================================"
echo ""
echo "Both client and server have been deployed to Vercel."
echo "Check your Vercel dashboard for the deployment URLs."
echo ""
