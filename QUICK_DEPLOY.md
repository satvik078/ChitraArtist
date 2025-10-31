# ⚡ Quick Deployment - 3 Steps

Deploy your app **100% FREE** in under 15 minutes!

## 🚀 Step-by-Step

### Step 1: Push to GitHub (2 min)
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/aesthetic-art-club.git
git push -u origin main
```

### Step 2: Deploy Frontend on Vercel (5 min)

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your repository
4. Configure:
   - **Root Directory:** `frontend`
   - **Framework:** Vite (auto-detected)
5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com/api` (update after Step 3)
6. Click **"Deploy"**
7. ✅ Get your frontend URL: `https://your-app.vercel.app`

### Step 3: Deploy Backend on Render (8 min)

1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +" → "Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `aesthetic-art-club-backend`
   - **Root Directory:** `backend`
   - **Build Command:** (leave empty)
   - **Start Command:** `npm start`
5. Add Environment Variables (click "Advanced"):
   ```
   PORT=5001
   NODE_ENV=production
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-32-char-secret-key
   CLOUD_NAME=your-cloudinary-cloud-name
   API_KEY=your-cloudinary-api-key
   API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=https://your-frontend.vercel.app
   AI_SCORING_PROVIDER=simulated
   MAX_ARTWORKS_PER_ARTIST=100
   ```
6. Click **"Create Web Service"**
7. Wait 5-10 minutes for deployment
8. ✅ Get your backend URL: `https://your-backend.onrender.com`

### Step 4: Update Frontend URL (2 min)

1. Go to **Vercel Dashboard** → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to: `https://your-backend.onrender.com/api`
3. Click **"Redeploy"** (or wait for auto-redeploy)

### ✅ Done!

Your app is live! Visit your Vercel URL and test it.

---

## 🎯 Complete Setup (Detailed)

See **DEPLOYMENT_GUIDE.md** for:
- Detailed instructions
- Troubleshooting
- Alternative hosting options
- Security checklist

---

## 📝 Environment Variables Checklist

### Backend (Render):
- ✅ `MONGO_URI` - MongoDB Atlas connection string
- ✅ `JWT_SECRET` - Random 32+ character string
- ✅ `CLOUD_NAME`, `API_KEY`, `API_SECRET` - Cloudinary credentials
- ✅ `FRONTEND_URL` - Your Vercel frontend URL (https://...)
- ✅ `AI_SCORING_PROVIDER` - `simulated` (or `huggingface` if you have API key)

### Frontend (Vercel):
- ✅ `VITE_API_URL` - Your Render backend URL (https://.../api)

---

## 🆘 Need Help?

**Common Issues:**
- **CORS Error?** → Check `FRONTEND_URL` in backend matches frontend URL exactly
- **Database Error?** → MongoDB Atlas → Network Access → Add `0.0.0.0/0`
- **Images Not Working?** → Verify Cloudinary credentials in backend env vars
- **Build Fails?** → Check build logs, ensure Node version is compatible

**Full Guide:** See `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.

