# ⚡ Deploy to Netlify - Quick Start

## 🎯 Fastest Way (5 Minutes)

### Step 1: Push to GitHub (if not done)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/shelter-map.git
git push -u origin main
```

### Step 2: Deploy to Netlify

1. Go to: **https://app.netlify.com/signup**
2. Click **"Sign up with GitHub"**
3. Click **"Add new site"** → **"Import an existing project"**
4. Click **"Deploy with GitHub"**
5. Select **`shelter-map`** repository
6. Verify settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
7. Click **"Deploy site"**
8. Wait 2-3 minutes ⏳
9. **Done!** 🎉

Your site: `https://random-name.netlify.app`

### Step 3: Customize URL (Optional)

1. Site settings → Site details
2. Change site name to: `shelter-map`
3. New URL: `https://shelter-map.netlify.app`

---

## 🔄 Update Your Site

After making changes:

```bash
git add .
git commit -m "Update features"
git push
```

Netlify automatically rebuilds and deploys! (2-3 minutes)

---

## 📱 Test Your Live Site

Open: `https://shelter-map.netlify.app`

**Check:**
- ✅ Map loads with 26 markers
- ✅ Click markers for details
- ✅ Login works (Admin / 12345)
- ✅ All routes work (/, /admin, /coordinator)
- ✅ Install as PWA on mobile

---

## 🐛 If Build Fails

1. Check deploy log in Netlify dashboard
2. Common fix: Make sure `frontend/package.json` exists
3. Test build locally: `cd frontend && npm run build`

---

## 📚 Full Guide

See **NETLIFY_DEPLOYMENT.md** for:
- Detailed instructions
- CLI deployment
- Custom domains
- Troubleshooting
- Performance tips

---

**That's it!** Your ShelterMap is now live on the internet! 🌍
