# Deployment Script for Vercel (PowerShell)
# This script deploys both client and server to Vercel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Deploying Grocery Project to Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "Vercel CLI installed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Check if user is logged in to Vercel
Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
$whoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "You are not logged in to Vercel." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run the following command first:" -ForegroundColor Yellow
    Write-Host "  vercel login" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "After logging in, run this script again." -ForegroundColor Yellow
    exit 1
}
Write-Host "Logged in as: $whoami" -ForegroundColor Green
Write-Host ""

# Deploy Client
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Step 1: Deploying Client (React)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "client"

Write-Host "Building client..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful! Deploying to Vercel..." -ForegroundColor Green
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Client deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Client deployment failed!" -ForegroundColor Red
        Set-Location -Path ".."
        exit 1
    }
} else {
    Write-Host "Build failed! Please fix errors and try again." -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

Set-Location -Path ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Step 2: Deploying Server (Node.js)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location -Path "server"

Write-Host "Deploying server to Vercel..." -ForegroundColor Yellow
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "Server deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "Server deployment failed!" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

Set-Location -Path ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Both client and server have been deployed to Vercel." -ForegroundColor Green
Write-Host "Check your Vercel dashboard for the deployment URLs." -ForegroundColor Yellow
Write-Host ""
