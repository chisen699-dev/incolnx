# LincolnX - Quick Start Deployment Guide

## 🚀 Deploy to Netlify in 10 Minutes

### Prerequisites
- GitHub account
- Netlify account (free)
- MongoDB Atlas account (free)
- Render/Railway account (free)

---

## Step 1: Prepare Your Code

### 1.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - LincolnX Platform"
git remote add origin https://github.com/YOUR_USERNAME/lincolnx.git
git push -u origin main
```

### 1.2 Setup MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Create free account
3. Create cluster (M0 Sandbox - Free)
4. Database Access → Add User (create username/password)
5. Network Access → Allow from anywhere (0.0.0.0/0)
6. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/lincolnx`

---

## Step 2: Deploy Backend (Render.com)

### 2.1 Create Web Service
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: `lincolnx-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.2 Add Environment Variables
In Render dashboard → Environment tab:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lincolnx
JWT_SECRET=your_secure_random_string_here_12345
CLIENT_URL=https://lincolnx.netlify.app
ADMIN_URL=https://lincolnx-admin.netlify.app
```

### 2.3 Deploy
- Click "Create Web Service"
- Wait 2-3 minutes for deployment
- Copy your API URL: `https://lincolnx-api.onrender.com`

---

## Step 3: Deploy Client to Netlify

### 3.1 Create Netlify Site
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Connect GitHub
4. Select your repository

### 3.2 Configure Build Settings
```
Branch to deploy: main
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

### 3.3 Add Environment Variables
In Netlify dashboard → Site settings → Environment variables:

```env
VITE_API_URL=https://lincolnx-api.onrender.com/api
```

### 3.4 Deploy
- Click "Deploy site"
- Wait 2-3 minutes
- Your site will be at: `https://random-name.netlify.app`

### 3.5 Set Custom Domain (Optional)
1. Site settings → Domain management
2. Click "Add custom domain"
3. Enter: `lincolnx.netlify.app` (or your own domain)
4. Update in backend CORS settings

---

## Step 4: Deploy Admin Panel to Netlify

### 4.1 Create Second Netlify Site
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Connect same GitHub repository

### 4.2 Configure Build Settings
```
Branch to deploy: main
Base directory: admin
Build command: npm run build
Publish directory: admin/dist
```

### 4.3 Add Environment Variables
```env
VITE_API_URL=https://lincolnx-api.onrender.com/api
```

### 4.4 Deploy
- Click "Deploy site"
- Your admin will be at: `https://random-name-2.netlify.app`

### 4.5 Set Custom Domain (Optional)
- Add custom domain: `lincolnx-admin.netlify.app`

---

## Step 5: Update Backend CORS

### 5.1 Update server.js
The CORS is already configured to accept Netlify domains. Just make sure your environment variables are set:

```env
CLIENT_URL=https://lincolnx.netlify.app
ADMIN_URL=https://lincolnx-admin.netlify.app
```

### 5.2 Redeploy Backend
- Go to Render dashboard
- Click "Manual Deploy" → "Deploy latest commit"
- Wait for deployment to complete

---

## Step 6: Import Game Data

### 6.1 Run Import Script
```bash
cd backend
node scripts/import-games.js
```

This will import all games from games-data.js into MongoDB.

---

## Step 7: Test Everything

### 7.1 Test Client
1. Visit https://lincolnx.netlify.app
2. Login modal should appear
3. Try license key: `LX-ABCD-1234-EFGH` (or generate new one from admin)
4. Browse games
5. Test search and filters

### 7.2 Test Admin
1. Visit https://lincolnx-admin.netlify.app
2. Check statistics load
3. Generate license key
4. Add a test game
5. Verify it appears on client

### 7.3 Test API
1. Visit https://lincolnx-api.onrender.com/api/health
2. Should return: `{"status":"ok","message":"LincolnX API is running"}`

---

## 🎉 You're Live!

Your platform is now deployed:
- **Client**: https://lincolnx.netlify.app
- **Admin**: https://lincolnx-admin.netlify.app
- **API**: https://lincolnx-api.onrender.com

---

## Common Issues & Solutions

### Issue 1: Build Fails on Netlify

**Error**: "npm run build" fails

**Solution**:
1. Check build logs in Netlify
2. Ensure package.json has all dependencies
3. Verify Node version is 18.x
4. Check for missing files

### Issue 2: CORS Errors

**Error**: "Access-Control-Allow-Origin" error

**Solution**:
1. Verify CLIENT_URL and ADMIN_URL in Render
2. Check backend CORS configuration
3. Ensure API URL is correct in Netlify env vars
4. Redeploy backend after changes

### Issue 3: Games Not Loading

**Error**: Empty game list

**Solution**:
1. Run import script: `node backend/scripts/import-games.js`
2. Check MongoDB connection in Render logs
3. Verify API endpoint: https://lincolnx-api.onrender.com/api/games
4. Check browser console for errors

### Issue 4: 404 on Refresh

**Error**: Page not found on refresh

**Solution**:
This is already fixed in netlify.toml with SPA redirects. If still happening:
1. Verify netlify.toml is in root directory
2. Check redirects configuration
3. Redeploy site

### Issue 5: API Connection Failed

**Error**: Cannot connect to API

**Solution**:
1. Verify API is running: https://lincolnx-api.onrender.com/api/health
2. Check VITE_API_URL in Netlify environment variables
3. Ensure no trailing slash in API URL
4. Check backend logs on Render

---

## Environment Variables Checklist

### Backend (Render)
- [ ] NODE_ENV=production
- [ ] PORT=5000
- [ ] MONGODB_URI=your_mongodb_connection_string
- [ ] JWT_SECRET=your_secure_secret
- [ ] CLIENT_URL=https://lincolnx.netlify.app
- [ ] ADMIN_URL=https://lincolnx-admin.netlify.app

### Client (Netlify)
- [ ] VITE_API_URL=https://lincolnx-api.onrender.com/api

### Admin (Netlify)
- [ ] VITE_API_URL=https://lincolnx-api.onrender.com/api

---

## Custom Domain Setup (Optional)

### For Client
1. Buy domain (e.g., lincolnx.com)
2. Netlify → Domain management → Add custom domain
3. Update DNS at your registrar:
   - Nameservers: dns1.p01.nsone.net, dns2.p01.nsone.net, etc.
   - Or CNAME: lincolnx.com → lincolnx.netlify.app
4. Wait 5-10 minutes for SSL

### Update All References
After getting custom domain, update:
1. Backend CORS in server.js
2. Backend environment variables (CLIENT_URL, ADMIN_URL)
3. Client admin link in App.jsx
4. Redeploy all three services

---

## Continuous Deployment

### Auto-Deploy Setup
1. **GitHub Integration**: Already connected
2. **Auto-deploy**: Enabled by default
3. **Branch**: main (production)
4. **Preview branches**: All other branches

### Deploy Workflow
```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Netlify automatically:
# 1. Detects push
# 2. Builds client and admin
# 3. Deploys to production
```

---

## Monitoring & Maintenance

### 1. Check Logs
- **Netlify**: Deployments → View logs
- **Render**: Logs tab
- **MongoDB**: Atlas → Metrics

### 2. Monitor Performance
- Netlify Analytics (free)
- Render Metrics (free)
- MongoDB Atlas Monitoring (free)

### 3. Backup Database
```bash
# Export from MongoDB Atlas
# Atlas → Collections → Export
# Or use mongodump:
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/lincolnx"
```

---

## Cost Breakdown

### Free Tier (Perfect for starting)
- Netlify: Free (100GB bandwidth/month)
- Render: Free (with sleep after 15 min inactivity)
- MongoDB Atlas: Free (512MB storage)
- **Total: $0/month**

### Production (~$20/month)
- Netlify Pro: $19/month (optional, for more bandwidth)
- Render Starter: $7/month (no sleep, faster)
- MongoDB M2: $9/month (2GB storage)
- **Total: $7-35/month**

---

## Next Steps

1. ✅ Deploy all services
2. ✅ Test all features
3. ✅ Setup custom domain (optional)
4. ✅ Enable analytics
5. ✅ Share with users!

---

## Support

If you need help:
1. Check DEPLOYMENT.md for detailed guide
2. Check HOW_IT_WORKS.md for architecture
3. Review Netlify/Render logs
4. Test API endpoints with Postman

---

## Quick Commands Reference

```bash
# Local development
npm run dev-all          # Start all services
npm run dev-backend      # Start backend only
npm run dev-client       # Start client only
npm run dev-admin        # Start admin only

# Production build
npm run build-all        # Build client and admin
npm run import-games     # Import games to database

# Setup
npm run setup            # Install all dependencies + import games
```

---

## Success Checklist

- [ ] Backend deployed and running
- [ ] MongoDB connected
- [ ] Games imported
- [ ] Client deployed on Netlify
- [ ] Admin deployed on Netlify
- [ ] Can login with license key
- [ ] Games display correctly
- [ ] Admin can add/edit games
- [ ] CORS working (no errors)
- [ ] Custom domain configured (optional)

---

**Your LincolnX platform is now live and ready for users!** 🎮🚀