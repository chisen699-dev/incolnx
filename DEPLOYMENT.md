# LincolnX - Netlify Deployment Guide

This guide will help you deploy your LincolnX application to Netlify for live hosting.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    NETLIFY HOSTING                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐              ┌──────────────┐        │
│  │   Client     │              │    Admin     │        │
│  │  (Netlify)   │              │  (Netlify)   │        │
│  │  lincolnx.netlify.app  │      │ lincolnx-admin.netlify.app │
│  └──────┬───────┘              └──────┬───────┘        │
│         │                             │                 │
│         └──────────┬──────────────────┘                 │
│                    │                                    │
│         ┌──────────▼──────────────────┐                 │
│         │     Backend API              │                 │
│         │  (Render/Railway/Heroku)     │                 │
│         │  your-api.onrender.com       │                 │
│         └──────────┬──────────────────┘                 │
│                    │                                    │
│         ┌──────────▼──────────────────┐                 │
│         │     MongoDB Atlas            │                 │
│         │  (Cloud Database)            │                 │
│         └─────────────────────────────┘                 │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Netlify Account** - Sign up at https://netlify.com
2. **Backend Hosting** - Choose one:
   - Render (https://render.com) - Recommended
   - Railway (https://railway.app)
   - Heroku (https://heroku.com)
3. **MongoDB Atlas** - Sign up at https://mongodb.com/atlas (Free tier available)

---

## Step 1: Deploy Backend API

### Option A: Deploy to Render (Recommended)

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/lincolnx.git
   git push -u origin main
   ```

2. **Create Render Web Service**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     ```
     Name: lincolnx-api
     Region: Choose closest to you
     Branch: main
     Root Directory: backend
     Runtime: Node
     Build Command: npm install
     Start Command: npm start
     ```

3. **Add Environment Variables**
   In Render dashboard, go to "Environment" tab and add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret_key_here
   CLIENT_URL=https://lincolnx.netlify.app
   ADMIN_URL=https://lincolnx-admin.netlify.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your API will be at: `https://lincolnx-api.onrender.com`

### Option B: Deploy to Railway

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. Deploy:
   ```bash
   cd backend
   railway init
   railway up
   ```

3. Add environment variables in Railway dashboard

---

## Step 2: Setup MongoDB Atlas

1. **Create Cluster**
   - Go to https://cloud.mongodb.com
   - Create free account
   - Create cluster (M0 Sandbox - Free)

2. **Configure Database**
   - Click "Database Access" → Add Database User
   - Create username and password
   - Click "Network Access" → Add IP Address
   - Allow access from anywhere (0.0.0.0/0) for testing

3. **Get Connection String**
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `lincolnx`

4. **Import Game Data**
   ```bash
   # Run locally first
   cd backend
   node scripts/import-games.js
   ```

---

## Step 3: Deploy Client to Netlify

### Method 1: Drag & Drop (Quick)

1. **Build locally**:
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy**:
   - Go to https://app.netlify.com/drop
   - Drag the `client/dist` folder
   - Your site will be live at: `https://random-name.netlify.app`

3. **Configure custom domain** (optional):
   - Site settings → Domain management → Add custom domain

### Method 2: Git Integration (Recommended)

1. **Update client/.env.example**:
   ```env
   VITE_API_URL=https://your-backend-api.onrender.com/api
   ```

2. **Create netlify.toml in client folder** (already created at root):
   ```toml
   [build]
     base = "client/"
     publish = "dist/"
     command = "npm run build"
   ```

3. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   cd client
   netlify init
   netlify deploy --prod
   ```

4. **Or use Netlify Dashboard**:
   - New site from Git
   - Connect GitHub repository
   - Configure:
     ```
     Branch: main
     Base directory: client
     Build command: npm run build
     Publish directory: client/dist
     ```
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-api.onrender.com/api
     ```

5. **Deploy**
   - Click "Deploy site"
   - Your client will be at: `https://lincolnx.netlify.app`

---

## Step 4: Deploy Admin Panel to Netlify

1. **Create netlify.toml for admin** (create new file):
   ```toml
   [build]
     base = "admin/"
     publish = "dist/"
     command = "npm run build"
   ```

2. **Deploy via Netlify Dashboard**:
   - New site from Git
   - Connect GitHub repository
   - Configure:
     ```
     Branch: main
     Base directory: admin
     Build command: npm run build
     Publish directory: admin/dist
     ```
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-api.onrender.com/api
     ```

3. **Deploy**
   - Click "Deploy site"
   - Your admin will be at: `https://lincolnx-admin.netlify.app`

---

## Step 5: Update Configuration

### Update Backend CORS

In `backend/server.js`, update CORS configuration:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://lincolnx.netlify.app',
    'https://lincolnx-admin.netlify.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true
}));
```

### Update Client Admin Link

In `client/src/App.jsx`, update the admin link:

```jsx
<a href="https://lincolnx-admin.netlify.app" className="nav-admin-btn">⚙️ ADMIN</a>
```

---

## Step 6: Test Deployment

1. **Test Client**:
   - Visit https://lincolnx.netlify.app
   - Try logging in with a license key
   - Browse games
   - Test search and filters

2. **Test Admin**:
   - Visit https://lincolnx-admin.netlify.app
   - Check statistics
   - Generate license key
   - Add/edit/delete games

3. **Test API**:
   - Visit https://your-api.onrender.com/api/health
   - Should return: `{"status":"ok","message":"LincolnX API is running"}`

---

## Environment Variables Summary

### Backend (Render/Railway)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lincolnx
JWT_SECRET=your_very_secure_secret_key_here
CLIENT_URL=https://lincolnx.netlify.app
ADMIN_URL=https://lincolnx-admin.netlify.app
```

### Client (Netlify)
```env
VITE_API_URL=https://your-backend-api.onrender.com/api
```

### Admin (Netlify)
```env
VITE_API_URL=https://your-backend-api.onrender.com/api
```

---

## Custom Domains (Optional)

### Connect Custom Domain to Netlify

1. **Buy domain** from:
   - Namecheap
   - GoDaddy
   - Google Domains

2. **Add to Netlify**:
   - Site settings → Domain management → Add custom domain
   - Enter your domain (e.g., lincolnx.com)
   - Verify ownership

3. **Update DNS**:
   - Go to your domain registrar
   - Update nameservers to:
     ```
     dns1.p01.nsone.net
     dns2.p01.nsone.net
     dns3.p01.nsone.net
     dns4.p01.nsone.net
     ```
   - Or add CNAME record pointing to your Netlify site

4. **Enable HTTPS**:
   - Netlify automatically provisions SSL certificate
   - Takes 5-10 minutes

---

## Troubleshooting

### Build Fails on Netlify

**Problem**: Build command fails

**Solution**:
1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in package.json
3. Verify Node version (use 18.x)
4. Check for missing environment variables

### CORS Errors

**Problem**: API requests blocked

**Solution**:
1. Verify CLIENT_URL and ADMIN_URL in backend
2. Check CORS configuration in server.js
3. Ensure API URL is correct in client/admin .env

### API Not Responding

**Problem**: 404 or connection errors

**Solution**:
1. Check backend is running on Render/Railway
2. Verify API URL in environment variables
3. Check backend logs for errors
4. Ensure MongoDB is connected

### Games Not Loading

**Problem**: Empty game list

**Solution**:
1. Run import script: `node backend/scripts/import-games.js`
2. Check MongoDB connection
3. Verify API endpoint: `/api/games`
4. Check browser console for errors

---

## Continuous Deployment

### Auto-Deploy on Git Push

1. **Connect GitHub**:
   - Netlify automatically detects pushes
   - Rebuilds and deploys automatically

2. **Branch Configuration**:
   - Production branch: `main`
   - Preview branches: All other branches

3. **Deploy Previews**:
   - Every PR gets a preview URL
   - Test before merging to main

---

## Performance Optimization

### 1. Enable Netlify Features

In Netlify dashboard:
- ✅ Asset optimization
- ✅ Minification
- ✅ Gzip compression
- ✅ Image optimization

### 2. CDN

Netlify automatically serves assets via CDN:
- Global edge network
- Fast load times worldwide
- Automatic caching

### 3. Caching Strategy

Add to netlify.toml:
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    cache-control = "public, max-age=0, must-revalidate"
```

---

## Monitoring & Analytics

### 1. Netlify Analytics

Enable in dashboard:
- Page views
- Unique visitors
- Top pages
- Traffic sources

### 2. Backend Monitoring

Use Render/Railway dashboard:
- Request logs
- Error tracking
- Performance metrics
- Uptime monitoring

### 3. MongoDB Monitoring

Use MongoDB Atlas:
- Database metrics
- Query performance
- Connection stats

---

## Security Checklist

- ✅ Use HTTPS (Netlify provides free SSL)
- ✅ Set strong JWT_SECRET
- ✅ Enable CORS with specific origins
- ✅ Use environment variables (never commit secrets)
- ✅ Validate all inputs on backend
- ✅ Rate limiting (add to backend)
- ✅ MongoDB authentication enabled
- ✅ Regular backups of database

---

## Cost Estimate

### Free Tier (Development/Testing)
- Netlify: Free (100GB bandwidth/month)
- Render: Free (with limitations)
- MongoDB Atlas: Free (512MB storage)

### Production (~$20-30/month)
- Netlify Pro: $19/month (optional)
- Render: $7/month (Starter plan)
- MongoDB Atlas: $9/month (M2 cluster)
- Domain: $10-15/year

---

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check backend logs on Render/Railway
3. Verify MongoDB connection
4. Test API endpoints with Postman
5. Check browser console for errors

---

## Quick Start Commands

```bash
# 1. Install dependencies
cd backend && npm install
cd ../client && npm install
cd ../admin && npm install

# 2. Setup environment
cp backend/.env.example backend/.env
cp client/.env.example client/.env
cp admin/.env.example admin/.env

# 3. Import games
cd backend && node scripts/import-games.js

# 4. Build for production
cd client && npm run build
cd ../admin && npm run build

# 5. Deploy to Netlify
# Follow steps above
```

---

## Next Steps

1. ✅ Deploy backend to Render/Railway
2. ✅ Setup MongoDB Atlas
3. ✅ Deploy client to Netlify
4. ✅ Deploy admin to Netlify
5. ✅ Test all features
6. ✅ Configure custom domain
7. ✅ Enable analytics
8. ✅ Setup monitoring

Your LincolnX platform is now live! 🚀