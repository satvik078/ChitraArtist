# 🚀 Free Deployment Guide - Aesthetic Art Club

Deploy your full-stack art portfolio platform **100% FREE** with these services.

## 📋 What We're Deploying

1. **Frontend** (React/Vite) → **Vercel** (recommended) or Netlify
2. **Backend** (Express/Node.js) → **Render** (recommended) or Railway
3. **Database** (MongoDB) → **MongoDB Atlas** (already set up ✅)
4. **Storage** (Images) → **Cloudinary** (already set up ✅)

---

## 🎯 Recommended Setup (Easiest)

### Frontend: Vercel
- ✅ **100% Free forever**
- ✅ Zero config for Vite/React
- ✅ Auto SSL, CDN, fast global
- ✅ Automatic deployments from GitHub

### Backend: Render
- ✅ **Free tier** (750 hours/month)
- ✅ Auto SSL
- ✅ Easy environment variables
- ✅ Auto-restart on crashes

---

## 📝 Pre-Deployment Checklist

1. ✅ Push code to GitHub (create repo if needed)
2. ✅ MongoDB Atlas configured (already done ✅)
3. ✅ Cloudinary configured (already done ✅)
4. ⚠️ Update environment variables (frontend & backend)

---

## 🔧 Step 1: Prepare Your Code

### 1.1 Push to GitHub

```bash
# In your project root
git init
git add .
git commit -m "Initial commit - Ready for deployment"
git branch -M main

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/aesthetic-art-club.git
git push -u origin main
```

### 1.2 Create Environment Variable Files

Create these files (they won't be committed to git):

**Frontend `.env` file** (`frontend/.env`):
```bash
VITE_API_URL=https://your-backend.onrender.com/api
```

**Backend `.env` file** (`backend/.env`):
```bash
PORT=5001
NODE_ENV=production

# MongoDB
MONGO_URI=mongodb+srv://your-connection-string

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Cloudinary
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend.vercel.app

# AI Scoring (optional)
AI_SCORING_PROVIDER=simulated
# If using Hugging Face:
# HUGGINGFACE_API_KEY=hf_your_token_here

# Artwork Limits
MAX_ARTWORKS_PER_ARTIST=100
```

---

## 🌐 Step 2: Deploy Frontend (Vercel) - RECOMMENDED

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to https://vercel.com/**
2. **Sign up** with GitHub account
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure project:**
   - Framework Preset: `Vite`
   - Root Directory: `frontend` (click "Edit" if needed)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
6. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api` (you'll update this after deploying backend)
7. **Click "Deploy"**
8. **Wait 2-3 minutes** - Your site goes live! 🎉
9. **Get your frontend URL** (e.g., `https://aesthetic-art-club.vercel.app`)

### Option B: Via Vercel CLI

```bash
npm i -g vercel
cd frontend
vercel login
vercel
# Follow prompts
# When asked for environment variables:
# VITE_API_URL=https://your-backend.onrender.com/api
```

---

## ⚙️ Step 3: Deploy Backend (Render) - RECOMMENDED

1. **Go to https://render.com/**
2. **Sign up** with GitHub account
3. **Click "New +" → "Web Service"**
4. **Connect your GitHub repository**
5. **Configure service:**
   - **Name:** `aesthetic-art-club-backend` (or any name)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** Leave empty (Render auto-detects)
   - **Start Command:** `npm start`
6. **Click "Advanced" → Add Environment Variables:**
   ```
   PORT=5001
   NODE_ENV=production
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secret-key-minimum-32-characters
   CLOUD_NAME=your-cloudinary-cloud-name
   API_KEY=your-cloudinary-api-key
   API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=https://your-frontend.vercel.app
   AI_SCORING_PROVIDER=simulated
   MAX_ARTWORKS_PER_ARTIST=100
   ```
7. **Click "Create Web Service"**
8. **Wait 5-10 minutes** for first deployment
9. **Get your backend URL** (e.g., `https://aesthetic-art-club-backend.onrender.com`)

### ⚠️ Important: Update Frontend URL

After backend deploys, update your **frontend** environment variable in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to your Render backend URL
3. Click "Redeploy" (or wait for auto-redeploy)

---

## 🔄 Step 4: Update CORS Settings

Update your backend `.env` in Render to include your frontend URL:

```
FRONTEND_URL=https://your-frontend.vercel.app
```

Render will auto-restart the service.

---

## ✅ Step 5: Test Your Live Site

1. **Visit your frontend URL** (from Vercel)
2. **Try signing up** - Should work!
3. **Upload artwork** - Should work!
4. **Check competition** - Should show scores!

---

## 🎯 Alternative: Deploy Both on Railway (All-in-One)

**Railway** can host both frontend and backend in one account:

1. **Go to https://railway.app/**
2. **Sign up** with GitHub
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Add first service** (Backend):
   - Select repo → Root directory: `backend`
   - Add environment variables
   - Deploy
5. **Add second service** (Frontend):
   - Same repo → Root directory: `frontend`
   - Build command: `npm run build`
   - Start command: `npx serve -s dist -l 3000`
   - Add environment variables
   - Deploy

**Railway Free Tier:** $5/month credit (usually enough for small apps)

---

## 🎯 Alternative: Netlify + Render

### Frontend on Netlify:

1. **Go to https://netlify.com/**
2. **Sign up** with GitHub
3. **Add new site** → Import from Git
4. **Configure:**
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Add environment variable:**
   - `VITE_API_URL=https://your-backend.onrender.com/api`

Netlify is also **100% free** and great for frontend!

---

## 🐛 Troubleshooting

### Issue: "CORS Error"
**Solution:** Make sure `FRONTEND_URL` in backend matches your exact frontend URL (with https://)

### Issue: "Cannot connect to database"
**Solution:** 
- Check MongoDB Atlas IP whitelist → Add `0.0.0.0/0` (allow all)
- Verify connection string in backend env vars

### Issue: "Images not uploading"
**Solution:**
- Check Cloudinary credentials in backend env vars
- Verify Cloudinary account is active

### Issue: "Frontend can't reach backend"
**Solution:**
- Check `VITE_API_URL` in frontend env vars
- Make sure backend URL includes `/api` at the end
- Verify backend is running (check Render dashboard)

### Issue: "Build fails"
**Solution:**
- Check build logs in Vercel/Netlify
- Make sure `package.json` has correct scripts
- Check Node version compatibility

---

## 📊 Free Tier Limits

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | ✅ Forever | Unlimited builds, 100GB bandwidth/month |
| **Render** | ✅ Free | 750 hours/month (enough for 1 service 24/7) |
| **Netlify** | ✅ Forever | 100GB bandwidth/month, 300 build minutes |
| **Railway** | ⚠️ $5 credit | ~$5/month credit, usually enough |

**Recommendation:** Vercel (frontend) + Render (backend) = 100% free forever!

---

## 🔐 Security Checklist

- ✅ Don't commit `.env` files (already in `.gitignore`)
- ✅ Use strong `JWT_SECRET` (32+ characters)
- ✅ MongoDB Atlas: Use strong password
- ✅ Enable MongoDB Atlas IP whitelist (add your server IPs)
- ✅ Cloudinary: Keep API secrets secure

---

## 🎉 You're Live!

After deployment:
1. ✅ Share your frontend URL with artists
2. ✅ Monitor backend logs in Render
3. ✅ Check Vercel analytics for visitors
4. ✅ Set up custom domain (optional, Vercel/Netlify support free subdomains)

---

## 📚 Next Steps

- **Custom Domain:** Add your own domain via Vercel/Netlify (free SSL included)
- **Monitoring:** Use Render's built-in logs or add Sentry (free tier)
- **Backups:** MongoDB Atlas has automatic backups
- **Scaling:** If you outgrow free tiers, consider upgrading (but free tier should handle many users!)

**Your art portfolio platform is now live on the internet! 🎨✨**

