# Quick Deployment Guide

## You're Already Logged In! ✓

Now just run the deployment script and follow the prompts:

```powershell
.\deploy.ps1
```

## What Will Happen:

### First Time Deployment - Vercel Will Ask:

**For Client (React):**
1. "Set up and deploy?" → Choose **Yes**
2. "Which scope?" → Choose **your account name**
3. "Link to existing project?" → Choose **No** (first time)
4. "What's your project's name?" → Type: **grocary-client** (or any name)
5. "In which directory is your code located?" → Press **Enter** (uses current)
6. "Want to override settings?" → Choose **No**

**For Server (Node.js):**
1. Same questions as above
2. Project name: **grocary-server** (or any name)

### That's It!

After answering these questions once, future deployments will be automatic.

## Alternative: Deploy Manually

**If you prefer step-by-step:**

### 1. Deploy Client:
```powershell
cd client
npm run build
vercel --prod
cd ..
```

### 2. Deploy Server:
```powershell
cd server
vercel --prod
cd ..
```

## After Deployment:

1. Copy the deployment URLs from terminal
2. Update environment variables in Vercel dashboard:
   - Go to https://vercel.com/dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add your variables (VITE_BACKEND_URL, JWT_SECRET, etc.)

## Pro Tip:

To make future deployments even faster, connect your GitHub repository:
1. Push code to GitHub
2. In Vercel dashboard, import your Git repository
3. Every push will auto-deploy!

---

**Ready? Just run:** `.\deploy.ps1`
