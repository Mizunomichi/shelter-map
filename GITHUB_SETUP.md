# 🚀 Push ShelterMap to GitHub

This guide will help you push your ShelterMap project to GitHub.

## Prerequisites

1. **Git installed** - [Download Git](https://git-scm.com/downloads)
2. **GitHub account** - [Sign up](https://github.com/signup)

## Step-by-Step Guide

### Step 1: Install Git (if not installed)

**Windows:**
1. Download Git from https://git-scm.com/downloads
2. Run the installer
3. Use default settings
4. Restart your terminal/PowerShell

**Verify installation:**
```bash
git --version
```

### Step 2: Configure Git

Set your name and email (use your GitHub email):

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in the details:
   - **Repository name:** `shelter-map` (or your preferred name)
   - **Description:** "Real-time evacuation center capacity monitoring PWA"
   - **Visibility:** Public or Private (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Click **"Create repository"**

### Step 4: Initialize Git in Your Project

Open PowerShell in your project directory and run:

```bash
# Initialize git repository
git init

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit: ShelterMap PWA with 26 evacuation centers"
```

### Step 5: Connect to GitHub

Replace `YOUR_USERNAME` and `REPOSITORY_NAME` with your actual GitHub username and repo name:

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git

# Verify remote was added
git remote -v
```

### Step 6: Push to GitHub

```bash
# Push to GitHub (main branch)
git push -u origin main
```

If you get an error about "master" vs "main", try:
```bash
git branch -M main
git push -u origin main
```

### Step 7: Verify on GitHub

1. Go to your repository on GitHub
2. Refresh the page
3. You should see all your files!

## 🎉 Success!

Your ShelterMap project is now on GitHub!

## Common Issues & Solutions

### Issue: Git not recognized

**Solution:** Restart your terminal after installing Git, or add Git to your PATH manually.

### Issue: Authentication failed

**Solution:** GitHub no longer accepts password authentication. Use a Personal Access Token (PAT):

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "ShelterMap")
4. Select scopes: `repo` (full control)
5. Click "Generate token"
6. Copy the token (you won't see it again!)
7. When pushing, use the token as your password

**Or use GitHub CLI:**
```bash
# Install GitHub CLI
winget install GitHub.cli

# Authenticate
gh auth login
```

### Issue: Permission denied

**Solution:** Make sure you're the owner of the repository or have write access.

### Issue: Remote already exists

**Solution:** Remove and re-add the remote:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
```

## Next Steps After Pushing

### 1. Add a Repository Description

On GitHub, click "About" (gear icon) and add:
- Description: "Real-time evacuation center capacity monitoring PWA"
- Website: Your deployed URL (if any)
- Topics: `pwa`, `disaster-management`, `philippines`, `leaflet`, `typescript`, `supabase`

### 2. Enable GitHub Pages (Optional)

To host your project for free:

1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` → `/docs` or `/root`
4. Save

Or use Vercel/Netlify for better PWA support.

### 3. Add Badges to README

Your README already has some badges. You can add more:

```markdown
![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/shelter-map)
![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/shelter-map)
![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/shelter-map)
```

### 4. Create a Release

1. Go to Releases → "Create a new release"
2. Tag: `v1.0.0`
3. Title: "ShelterMap v1.0.0 - Initial Release"
4. Description: List features and improvements
5. Publish release

## Updating Your Repository

After making changes:

```bash
# Check status
git status

# Add changed files
git add .

# Commit with message
git commit -m "Add new feature or fix bug"

# Push to GitHub
git push
```

## Useful Git Commands

```bash
# View commit history
git log --oneline

# View current branch
git branch

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Pull latest changes
git pull

# View differences
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git reset --hard HEAD
```

## Collaboration

### Inviting Collaborators

1. Go to repository Settings → Collaborators
2. Click "Add people"
3. Enter their GitHub username
4. They'll receive an invitation

### Accepting Pull Requests

1. Go to Pull Requests tab
2. Review the changes
3. Add comments if needed
4. Click "Merge pull request"

## GitHub Repository Settings

### Recommended Settings:

**General:**
- ✅ Allow merge commits
- ✅ Allow squash merging
- ✅ Allow rebase merging
- ✅ Automatically delete head branches

**Branches:**
- Add branch protection rule for `main`:
  - ✅ Require pull request reviews before merging
  - ✅ Require status checks to pass

**Security:**
- ✅ Enable Dependabot alerts
- ✅ Enable Dependabot security updates

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitHub CLI](https://cli.github.com/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

---

**Need help?** Open an issue on GitHub or check the [Git documentation](https://git-scm.com/doc).
