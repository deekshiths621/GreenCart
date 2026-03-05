# Preview Deployment Script for Vercel (PowerShell)
# This script deploys both client and server to Vercel preview environment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Preview Deployment to Vercel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Deploy Client (Preview)
Write-Host "Deploying Client to Preview..." -ForegroundColor Yellow
Set-Location -Path "client"
npm run build
vercel
Set-Location -Path ".."

Write-Host ""

# Deploy Server (Preview)
Write-Host "Deploying Server to Preview..." -ForegroundColor Yellow
Set-Location -Path "server"
vercel
Set-Location -Path ".."

Write-Host ""
Write-Host "Preview deployment complete!" -ForegroundColor Green
