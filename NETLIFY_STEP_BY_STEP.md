# 📖 Netlify Deployment - Step by Step with Screenshots Guide

## 🎬 Complete Visual Walkthrough

### Prerequisites Checklist

Before starting:
- [ ] Project code is ready
- [ ] GitHub account created
- [ ] Project pushed to GitHub (optional but recommended)

---

## Part 1: Sign Up for Netlify

### Step 1: Go to Netlify
Open your browser and go to: **https://app.netlify.com/signup**

### Step 2: Choose Sign Up Method
You'll see three options:
- **GitHub** (Recommended - easiest for continuous deployment)
- **GitLab**
- **Bitbucket**
- **Email**

**Click: "Sign up with GitHub"**

### Step 3: Authorize Netlify
- GitHub will ask you to authorize Netlify
- Click **"Authorize Netlify"**
- You're now logged into Netlify!

---

## Part 2: Deploy Your Site

### Method A: From GitHub Repository (Recommended)

#### Step 1: Add New Site
- Click the **"Add new site"** button (top right)
- Select **"Import an existing project"**

#### Step 2: Connect to Git Provider
- Click **"Deploy with GitHub"**
- If prompted, authorize Netlify to access your repositories

#### Step 3: Select Repository
- You'll see a list of your GitHub repositories
- Search for: **`shelter-map`**
- Click on it to select

#### Step 4: Configure Build Settings
Netlify will show build settings:

**Site settings:**
- **Branch to deploy:** `main` (should be auto-selected)

**Build settings:**
- **Base directory:** Leave empty (or type `frontend`)
- **Build command:** `cd frontend && npm install && npm run build`
- **Publish directory:** `frontend/dist`

**Advanced build settings (optional):**
- Click **"Show advanced"**
- Add environment variable:
  - **Key:** `NODE_VERSION`
  - **Value:** `18`

#### Step 5: Deploy!
- Click **"Deploy site"** button
- Netlify will start building your site
- You'll see the build log in real-time

**Build process:**
1. ⏳ Initializing (10 seconds)
2. ⏳ Installing dependencies (1-2 minutes)
3. ⏳ Building project (30 seconds)
4. ⏳ Deploying to CDN (30 seconds)
5. ✅ **Site is live!**

#### Step 6: View Your Site
- Once complete, you'll see: **"Site is live"**
- Click the URL (looks like: `https://random-name-123456.netlify.app`)
- Your ShelterMap is now online! 🎉

---

### Method B: Drag and Drop (Quick Test)

#### Step 1: Build Locally
Open PowerShell in your project folder:

```bash
cd frontend
npm install
npm run build
```

This creates a `frontend/dist` folder with your built site.

#### Step 2: Go to Netlify Drop
Open: **https://app.netlify.com/drop**

#### Step 3: Drag and Drop
- Open File Explorer
- Navigate to: `C:\Users\Zildjian\Documents\KIRO_WORKSHOP\frontend\dist`
- Drag the **entire `dist` folder** onto the Netlify Drop page
- Wait for upload (30 seconds)
- **Done!** Your site is live

**Note:** This method doesn't connect to GitHub, so updates require manual re-upload.

---

### Method C: Netlify CLI (For Developers)

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Login
```bash
netlify login
```
This opens your browser to authenticate.

#### Step 3: Initialize Site
```bash
netlify init
```

Follow the prompts:
- **Create & configure a new site?** Yes
- **Team:** Select your team
- **Site name:** `shelter-map` (or leave blank)
- **Build command:** `cd frontend && npm install && npm run build`
- **Publish directory:** `frontend/dist`

#### Step 4: Deploy
```bash
netlify deploy --prod
```

Your site is live!

---

## Part 3: Customize Your Site

### Change Site Name

**Default URL:** `https://random-name-123456.netlify.app`  
**Custom URL:** `https://shelter-map.netlify.app`

**Steps:**
1. In Netlify dashboard, click your site
2. Go to **Site settings**
3. Click **"Change site name"** under Site details
4. Enter: `shelter-map`
5. Click **"Save"**
6. Your new URL is active immediately!

### Add Custom Domain (Optional)

If you own a domain (e.g., `sheltermap.com`):

1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain: `sheltermap.com`
4. Follow DNS configuration instructions
5. Netlify provides free SSL certificate

---

## Part 4: Automatic Deployments

Once connected to GitHub, every push triggers a new deployment:

### Workflow:

1. **Make changes** to your code locally
2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Add new features"
   ```
3. **Push to GitHub:**
   ```bash
   git push
   ```
4. **Netlify automatically:**
   - Detects the push
   - Starts a new build
   - Deploys the new version
   - Your site updates in 2-3 minutes

### Monitor Deployments:

1. Go to **Deploys** tab in Netlify
2. See all deployments with status:
   - 🟢 **Published** - Live on your site
   - 🟡 **Building** - Currently building
   - 🔴 **Failed** - Build error (check logs)

---

## Part 5: Testing Your Live Site

### Desktop Testing

1. **Open your site:** `https://shelter-map.netlify.app`

2. **Test features:**
   - ✅ Map loads with 26 markers (Manila + Cebu)
   - ✅ Click markers to see shelter details
   - ✅ Navigate to `/admin` - should redirect to login
   - ✅ Login with: Admin / 12345
   - ✅ Navigate to `/coordinator` - form loads
   - ✅ Check legend shows color codes

3. **Test offline:**
   - Open DevTools (F12)
   - Go to Network tab
   - Check "Offline" checkbox
   - Refresh page
   - Map should still load with cached data

### Mobile Testing

1. **Open on phone:** `https://shelter-map.netlify.app`

2. **Install as PWA:**
   - **Chrome:** Menu → "Add to Home Screen"
   - **Safari:** Share → "Add to Home Screen"
   - Icon appears on home screen

3. **Test PWA:**
   - Open from home screen icon
   - Should open in standalone mode (no browser UI)
   - Test offline mode (airplane mode)

### Performance Testing

1. **Open DevTools** (F12)
2. Go to **Lighthouse** tab
3. Click **"Generate report"**
4. Check scores:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+
   - SEO: 90+
   - PWA: 100

---

## Part 6: Monitoring and Analytics

### Netlify Dashboard

Access: **https://app.netlify.com**

**Key sections:**

1. **Overview**
   - Deploy status
   - Site URL
   - Last deploy time

2. **Deploys**
   - All deployments
   - Build logs
   - Deploy previews

3. **Site settings**
   - Domain settings
   - Build settings
   - Environment variables

4. **Analytics** (paid feature)
   - Visitor stats
   - Page views
   - Traffic sources

### Deploy Notifications

Set up notifications:
1. Go to **Site settings** → **Build & deploy** → **Deploy notifications**
2. Add notification:
   - **Email** - Get notified on deploy success/failure
   - **Slack** - Post to Slack channel
   - **Webhook** - Custom integrations

---

## Part 7: Troubleshooting

### Build Failed

**Symptom:** Deploy shows "Failed" status

**Solution:**
1. Click the failed deploy
2. Read the build log
3. Look for error messages

**Common errors:**

**"Command not found: npm"**
- Fix: Add `NODE_VERSION = "18"` to environment variables

**"Module not found"**
- Fix: Missing dependency in `package.json`
- Add the dependency and push again

**"Build exceeded time limit"**
- Fix: Optimize build or upgrade plan
- Free tier: 300 build minutes/month

### Site Shows Blank Page

**Symptom:** Site loads but shows nothing

**Solution:**
1. Check browser console (F12)
2. Look for errors
3. Common issue: Wrong publish directory
   - Should be: `frontend/dist`
   - Not: `dist` or `frontend`

### Routes Don't Work (404 Error)

**Symptom:** `/admin` or `/coordinator` shows 404

**Solution:** Already fixed in `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

If still not working:
1. Make sure `netlify.toml` is in project root
2. Redeploy the site

### Environment Variables Not Working

**Symptom:** App can't connect to Supabase

**Solution:**
1. Go to **Site settings** → **Environment variables**
2. Add variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Trigger a new deploy (push a change or click "Trigger deploy")

---

## Part 8: Advanced Features

### Deploy Previews

Test changes before going live:

1. Create a branch: `git checkout -b feature/new-map`
2. Make changes and push
3. Create pull request on GitHub
4. Netlify creates a preview URL
5. Test the preview
6. Merge when ready

### Split Testing

Test two versions:

1. Go to **Split Testing** in Netlify
2. Create a branch with changes
3. Set traffic split (e.g., 50/50)
4. Monitor which performs better

### Forms (Bonus Feature)

Netlify can handle form submissions:

1. Add `netlify` attribute to forms:
```html
<form netlify>
  <input type="text" name="name">
  <button type="submit">Submit</button>
</form>
```

2. View submissions in Netlify dashboard
3. Free tier: 100 submissions/month

---

## ✅ Deployment Checklist

**Before deploying:**
- [ ] Code works locally (`npm run dev`)
- [ ] Build works locally (`npm run build`)
- [ ] Pushed to GitHub
- [ ] `netlify.toml` in project root

**After deploying:**
- [ ] Site loads correctly
- [ ] All routes work
- [ ] Login works
- [ ] Map shows 26 markers
- [ ] Mobile responsive
- [ ] PWA installs correctly
- [ ] Lighthouse score 90+

**Share your site:**
- [ ] Update README with live URL
- [ ] Share on social media
- [ ] Add to portfolio
- [ ] Send to stakeholders

---

## 🎉 Success!

Your ShelterMap is now live at:
```
https://shelter-map.netlify.app
```

**What you've accomplished:**
- ✅ Deployed a production PWA
- ✅ Set up automatic deployments
- ✅ Configured custom domain (optional)
- ✅ Enabled HTTPS
- ✅ Global CDN distribution
- ✅ PWA with offline support

**Next steps:**
- Share with users
- Monitor analytics
- Gather feedback
- Iterate and improve

---

**Need more help?**
- Full guide: `NETLIFY_DEPLOYMENT.md`
- Quick start: `DEPLOY_QUICK_START.md`
- Netlify docs: https://docs.netlify.com/
