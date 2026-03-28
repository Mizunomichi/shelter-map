# ⚠️ Git Not Installed - Install First!

## You Need to Install Git Before Pushing

I cannot push to GitHub because **Git is not installed** on your system.

## 🔧 Quick Install Steps:

### 1. Download Git
Go to: **https://git-scm.com/downloads**

Click the big "Download for Windows" button.

### 2. Install Git
- Run the downloaded installer
- Click "Next" through all screens (use default settings)
- Click "Install"
- Click "Finish"

### 3. Restart PowerShell
**Important:** Close and reopen PowerShell for Git to be recognized.

### 4. Verify Installation
Open PowerShell and type:
```bash
git --version
```

You should see: `git version 2.x.x`

## 🚀 After Installing Git

### Option A: Use the Batch Script (Easiest)

1. Double-click `push-to-github.bat` in your project folder
2. Follow the prompts
3. Done!

### Option B: Manual Commands

Open PowerShell in your project folder and run:

```bash
# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Initialize repository
git init

# Add all files
git add .

# Create commit
git commit -m "Initial commit: ShelterMap PWA with 26 evacuation centers"

# Add GitHub remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/shelter-map.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 📝 Before Running Commands

### Create GitHub Repository First:

1. Go to: https://github.com/new
2. Repository name: `shelter-map`
3. Description: "Real-time evacuation center capacity monitoring PWA"
4. Make it **Public**
5. **Don't check any boxes**
6. Click "Create repository"
7. Copy the repository URL

## 🎯 What Happens When You Push

Your project will be uploaded to GitHub with:
- ✅ 26 evacuation centers (Manila + Cebu)
- ✅ Modern UI with login system
- ✅ Interactive map
- ✅ Complete documentation
- ✅ Professional README
- ✅ MIT License

## ❓ Need Help?

If you have issues:
1. Make sure Git is installed: `git --version`
2. Make sure you restarted PowerShell
3. Check the repository URL is correct
4. Use a Personal Access Token for authentication (not password)

## 🔑 Authentication

When pushing, you'll need:
- **Username:** Your GitHub username
- **Password:** Use a Personal Access Token (not your password)

**Get a token:**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Copy the token
5. Use it as your password when pushing

---

**Install Git first, then come back and run the commands!** 🚀
