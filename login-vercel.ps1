# Vercel Login Helper Script
# Run this script first before deploying

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Vercel Login" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Logging in to Vercel..." -ForegroundColor Yellow
Write-Host "This will open your browser for authentication." -ForegroundColor Yellow
Write-Host ""

vercel login

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   Login Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run: .\deploy.ps1" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Login failed. Please try again." -ForegroundColor Red
}
