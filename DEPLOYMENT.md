# Deployment Guide

This project includes automated deployment scripts for Vercel.

## Prerequisites

1. Install Vercel CLI globally (scripts will do this automatically if not installed):
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel (first time only):
   ```bash
   vercel login
   ```

## Deployment Methods

### Method 1: Using PowerShell Script (Windows - Recommended)

**Production Deployment:**
```powershell
.\deploy.ps1
```

**Preview Deployment:**
```powershell
.\deploy-preview.ps1
```

### Method 2: Using Bash Script (Linux/Mac/Git Bash)

**Make script executable (first time only):**
```bash
chmod +x deploy.sh
```

**Production Deployment:**
```bash
./deploy.sh
```

### Method 3: Using NPM Scripts

**Deploy Client Only:**
```bash
cd client
npm run deploy          # Production
npm run deploy:preview  # Preview
```

**Deploy Server Only:**
```bash
cd server
npm run deploy          # Production
npm run deploy:preview  # Preview
```

### Method 4: Manual Deployment

**Client:**
```bash
cd client
npm run build
vercel --prod
```

**Server:**
```bash
cd server
vercel --prod
```

## What Each Script Does

### `deploy.ps1` / `deploy.sh`
- Checks if Vercel CLI is installed
- Builds the client (React app)
- Deploys client to Vercel production
- Deploys server to Vercel production
- Shows deployment URLs

### `deploy-preview.ps1`
- Deploys to Vercel preview environment (for testing)
- Doesn't affect production deployment

## First Time Setup

1. Run the deployment script
2. Vercel will prompt you to:
   - Link to existing project or create new
   - Set project name
   - Configure build settings
3. Follow the prompts for both client and server
4. Save the deployment URLs

## Environment Variables

Don't forget to set your environment variables in Vercel dashboard:

**Client:**
- `VITE_BACKEND_URL` - Your server URL

**Server:**
- `JWT_SECRET`
- `MONGODB_URI`
- `CLOUDINARY_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `STRIPE_SECRET_KEY`
- etc.

## Troubleshooting

**If deployment fails:**
1. Check if Vercel CLI is installed: `vercel --version`
2. Login to Vercel: `vercel login`
3. Check for build errors locally: `npm run build`
4. Check Vercel logs for detailed errors

**PowerShell execution policy error:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Quick Deploy (One Command)

Just run:
```powershell
.\deploy.ps1
```

That's it! Your entire project will be deployed to Vercel.
