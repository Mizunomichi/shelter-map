# ⚡ Quick Push to GitHub

## If Git is Already Installed

Run these commands in PowerShell (in your project directory):

```bash
# 1. Configure Git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 2. Initialize repository
git init

# 3. Add all files
git add .

# 4. Create first commit
git commit -m "Initial commit: ShelterMap PWA"

# 5. Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

## If Git is NOT Installed

1. **Download Git:** https://git-scm.com/downloads
2. **Install** with default settings
3. **Restart PowerShell**
4. Run the commands above

## Create GitHub Repository First

Before running the commands:

1. Go to https://github.com/new
2. Repository name: `shelter-map`
3. Description: "Real-time evacuation center monitoring PWA"
4. Public or Private
5. **DO NOT** check any boxes (no README, .gitignore, or license)
6. Click "Create repository"
7. Copy the repository URL
8. Use it in step 5 above

## Authentication

If asked for credentials:
- **Username:** Your GitHub username
- **Password:** Use a Personal Access Token (not your password)

**Get a token:**
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select `repo` scope
4. Copy the token
5. Use it as your password

## Done! 🎉

Your project is now on GitHub at:
```
https://github.com/YOUR_USERNAME/REPO_NAME
```

## Future Updates

After making changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

---

**Full guide:** See [GITHUB_SETUP.md](GITHUB_SETUP.md) for detailed instructions.
