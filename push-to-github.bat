@echo off
echo ========================================
echo ShelterMap - Push to GitHub
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Download from: https://git-scm.com/downloads
    echo 2. Install with default settings
    echo 3. Restart this terminal
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo Git is installed! Version:
git --version
echo.

REM Check if already initialized
if exist .git (
    echo Git repository already initialized.
    echo.
) else (
    echo Initializing Git repository...
    git init
    echo.
)

REM Configure Git (you'll need to edit these)
echo Configuring Git...
set /p USERNAME="Enter your name: "
set /p EMAIL="Enter your email: "
git config --global user.name "%USERNAME%"
git config --global user.email "%EMAIL%"
echo.

REM Add all files
echo Adding files to Git...
git add .
echo.

REM Create commit
echo Creating commit...
git commit -m "Initial commit: ShelterMap PWA with 26 evacuation centers"
echo.

REM Add remote
set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/username/shelter-map.git): "
git remote add origin %REPO_URL%
echo.

REM Push to GitHub
echo Pushing to GitHub...
git branch -M main
git push -u origin main
echo.

echo ========================================
echo SUCCESS! Your project is now on GitHub!
echo ========================================
echo.
pause
