# 🚀 Deploy ShelterMap to Netlify

Complete guide to deploy your ShelterMap PWA to Netlify for free!

## 🌟 Why Netlify?

- ✅ **Free hosting** for static sites and PWAs
- ✅ **Automatic HTTPS** with SSL certificate
- ✅ **Global CDN** for fast loading worldwide
- ✅ **Continuous deployment** from GitHub
- ✅ **Custom domains** supported
- ✅ **Perfect for PWAs** with service worker support

## 📋 Prerequisites

Before deploying, you need:
1. ✅ Project pushed to GitHub (see `PUSH_TO_GITHUB_INSTRUCTIONS.md`)
2. ✅ Netlify account (free) - [Sign up](https://app.netlify.com/signup)

## 🎯 Deployment Methods

### Method 1: Deploy from GitHub (Recommended)

This method enables automatic deployments whenever you push changes.

#### Step 1: Push to GitHub First

If you haven't already:
```bash
git init
git add .
git commit -m "Initial commit: ShelterMap PWA"
git remote add origin https://github.com/YOUR_USERNAME/shelter-map.git
git branch -M main
git push -u origin main
```

#### Step 2: Sign Up for Netlify

1. Go to: https://app.netlify.com/signup
2. Click **"Sign up with GitHub"** (easiest option)
3. Authorize Netlify to access your GitHub account

#### Step 3: Create New Site

1. Click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Authorize Netlify (if prompted)
4. Select your repository: **`shelter-map`**

#### Step 4: Configure Build Settings

Netlify should auto-detect the settings, but verify:

**Build settings:**
- **Base directory:** Leave empty (or enter `frontend`)
- **Build command:** `cd frontend && npm install && npm run build`
- **Publish directory:** `frontend/dist`

**Advanced settings (click "Show advanced"):**
- Add environment variable (optional):
  - Key: `NODE_VERSION`
  - Value: `18`

#### Step 5: Deploy!

1. Click **"Deploy site"**
2. Wait 2-3 minutes for the build to complete
3. Your site is live! 🎉

You'll get a URL like: `https://random-name-123456.netlify.app`

#### Step 6: Customize Site Name (Optional)

1. Go to **Site settings** → **Site details**
2. Click **"Change site name"**
3. Enter: `shelter-map` (or your preferred name)
4. Your new URL: `https://shelter-map.netlify.app`

---

### Method 2: Deploy via Netlify CLI

For developers who prefer command line.

#### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

#### Step 2: Login to Netlify

```bash
netlify login
```

This opens your browser to authenticate.

#### Step 3: Build Your Project

```bash
cd frontend
npm install
npm run build
```

#### Step 4: Deploy

**For a draft deploy (test first):**
```bash
netlify deploy
```

When prompted:
- Create & configure a new site? **Yes**
- Team: Select your team
- Site name: `shelter-map` (or leave blank for random)
- Publish directory: `frontend/dist`

**For production deploy:**
```bash
netlify deploy --prod
```

---

### Method 3: Drag and Drop (Quick Test)

Fastest way to test, but no automatic updates.

#### Step 1: Build Locally

```bash
cd frontend
npm install
npm run build
```

#### Step 2: Deploy

1. Go to: https://app.netlify.com/drop
2. Drag the `frontend/dist` folder onto the page
3. Done! Your site is live

**Note:** This method doesn't connect to GitHub, so updates require manual re-upload.

---

## 🔧 Configuration Files

I've created `netlify.toml` in your project root with:

- ✅ Build command configuration
- ✅ SPA routing redirects
- ✅ Security headers
- ✅ Cache optimization
- ✅ PWA support

**No additional configuration needed!**

---

## 🌐 Custom Domain (Optional)

### Using Netlify Subdomain (Free)

Your site URL: `https://shelter-map.netlify.app`

### Using Your Own Domain

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Netlify: **Domain settings** → **Add custom domain**
3. Enter your domain: `sheltermap.com`
4. Follow DNS configuration instructions
5. Netlify provides free SSL certificate

---

## 🔄 Automatic Deployments

Once connected to GitHub:

1. **Make changes** to your code
2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update map features"
   git push
   ```
3. **Netlify automatically:**
   - Detects the push
   - Builds your project
   - Deploys the new version
   - Updates your live site (2-3 minutes)

---

## 📊 Monitoring Your Site

### Netlify Dashboard

Access at: https://app.netlify.com

**Features:**
- 📈 **Analytics** - Visitor stats, page views
- 🔍 **Deploy logs** - Build output and errors
- 🌍 **Deploy previews** - Test before going live
- 📧 **Form submissions** - If you add forms
- 🔔 **Deploy notifications** - Email/Slack alerts

### Deploy Status Badge

Add to your README.md:

```markdown
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-SITE-ID/deploy-status)](https://app.netlify.com/sites/shelter-map/deploys)
```

Get your site ID from: Site settings → General → Site details

---

## 🐛 Troubleshooting

### Build Failed

**Check the deploy log:**
1. Go to **Deploys** tab
2. Click the failed deploy
3. Read the error message

**Common issues:**

**Error: "Command failed: npm run build"**
- Solution: Make sure `package.json` has the build script
- Check: `frontend/package.json` → `"build": "tsc && vite build"`

**Error: "Module not found"**
- Solution: Missing dependency
- Fix: Add to `frontend/package.json` and push

**Error: "Build exceeded time limit"**
- Solution: Optimize build or upgrade Netlify plan
- Free tier: 300 build minutes/month

### Site Shows 404

**Issue:** Routes not working (e.g., `/admin` shows 404)

**Solution:** Already fixed in `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

If you need to add environment variables:

1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Add your variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**Note:** Prefix with `VITE_` for Vite to include them in the build.

### PWA Not Installing

**Check:**
1. Site must be served over HTTPS (Netlify does this automatically)
2. Service worker must be registered
3. Manifest must be valid

**Test:**
- Open DevTools → Application → Manifest
- Check for errors

---

## 🎨 Deploy Previews

Netlify creates preview deployments for pull requests:

1. Create a branch: `git checkout -b feature/new-map`
2. Make changes and push
3. Create pull request on GitHub
4. Netlify automatically creates a preview URL
5. Test before merging

---

## 📱 Testing Your Deployed Site

### Desktop
1. Open: `https://shelter-map.netlify.app`
2. Test all features:
   - ✅ Map loads with 26 markers
   - ✅ Click markers to see popups
   - ✅ Login works (Admin / 12345)
   - ✅ Navigation works

### Mobile
1. Open on your phone
2. Test PWA installation:
   - Chrome: Menu → "Add to Home Screen"
   - Safari: Share → "Add to Home Screen"
3. Test offline mode:
   - Enable airplane mode
   - App should still work with cached data

### Lighthouse Audit
1. Open DevTools → Lighthouse
2. Run audit
3. Check scores:
   - Performance: Should be 90+
   - Accessibility: Should be 90+
   - Best Practices: Should be 90+
   - SEO: Should be 90+
   - PWA: Should be 100

---

## 🚀 Performance Optimization

### Already Optimized

Your `netlify.toml` includes:
- ✅ Asset caching (1 year)
- ✅ Service worker caching
- ✅ Gzip compression (automatic)
- ✅ CDN distribution (automatic)

### Additional Optimizations

**1. Image Optimization**
- Use WebP format
- Compress images before uploading
- Use Netlify Image CDN (paid feature)

**2. Code Splitting**
- Already done via Vite's dynamic imports
- Each route loads separately

**3. Preloading**
- Add to `index.html`:
```html
<link rel="preload" href="/assets/main.js" as="script">
```

---

## 💰 Pricing

**Free Tier (Perfect for ShelterMap):**
- ✅ 100 GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ HTTPS included
- ✅ Deploy previews
- ✅ Form submissions (100/month)

**Pro Tier ($19/month):**
- More bandwidth and build minutes
- Password protection
- Analytics
- Background functions

---

## 📚 Resources

- **Netlify Docs:** https://docs.netlify.com/
- **Netlify CLI:** https://docs.netlify.com/cli/get-started/
- **Netlify Community:** https://answers.netlify.com/
- **Status Page:** https://www.netlifystatus.com/

---

## ✅ Deployment Checklist

Before deploying:

- [ ] Project pushed to GitHub
- [ ] `netlify.toml` in project root
- [ ] Build command works locally (`npm run build`)
- [ ] Environment variables configured (if needed)
- [ ] README updated with live URL

After deploying:

- [ ] Test all routes (/, /coordinator, /admin, /login)
- [ ] Test on mobile device
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Run Lighthouse audit
- [ ] Update README with live URL
- [ ] Share with users!

---

## 🎉 Your Site is Live!

Once deployed, your ShelterMap will be accessible at:

```
https://shelter-map.netlify.app
```

**Features available:**
- 🗺️ Interactive map with 26 evacuation centers
- 📍 Real-time capacity monitoring
- 🔐 Admin login (Admin / 12345)
- 📱 PWA installation
- 🌐 Works offline
- ⚡ Fast global CDN
- 🔒 Secure HTTPS

**Share your live site with:**
- Emergency response teams
- Local government units
- Community organizations
- Disaster management agencies

---

**Need help?** Check the troubleshooting section or visit [Netlify Support](https://answers.netlify.com/)

**Ready to deploy?** Follow Method 1 above! 🚀
