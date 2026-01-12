@echo off
echo ===============================================
echo    Holistic Vet Clinic - Setup (Windows)
echo ===============================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js version:
node --version
echo.

:: Create public directory
echo Creating public directory...
if not exist "public" mkdir public
echo [OK] Public directory created
echo.

:: Move HTML file
echo Moving HTML file to public folder...
if exist "appointment-reminder-system.html" (
    move /Y appointment-reminder-system.html public\index.html >nul
    echo [OK] HTML file moved and renamed to index.html
) else (
    echo [WARNING] appointment-reminder-system.html not found
    echo It may have already been moved.
)
echo.

:: Install dependencies
echo Installing dependencies (this may take 2-3 minutes)...
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

echo.
echo ===============================================
echo    Setup Complete!
echo ===============================================
echo.
echo To start the application, run:
echo    start-server.bat
echo.
echo Or manually type:
echo    npm start
echo.
echo Then open your browser to:
echo    http://localhost:3000
echo.
pause
