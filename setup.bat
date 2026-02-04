@echo off
setlocal

echo Starting project setup...
echo This script will install dependencies, configure and start Supabase, and run the application.
echo.

REM --- Prerequisites Check ---
echo Checking for prerequisites...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo   [ERROR] NPM is not installed. Please install Node.js and NPM.
    goto :eof
)
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo   [ERROR] Docker is not installed. Please install Docker Desktop.
    goto :eof
)
docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo   [ERROR] Docker is not running. Please start Docker Desktop.
    goto :eof
)
echo   [OK] All prerequisites are met.
echo.

REM --- Install dependencies ---
echo Installing Node.js dependencies...
npm install
if %errorlevel% neq 0 (
    echo   [ERROR] Failed to install dependencies.
    goto :eof
)
echo   [OK] Dependencies installed successfully.
echo.

REM --- Set up environment variables ---
echo Setting up environment variables...
if not exist .env (
    copy .env.example .env
    echo   [OK] .env file created from .env.example.
    echo   [INFO] The script will use the default local Supabase keys.
) else (
    echo   [INFO] .env file already exists. Skipping creation.
)
echo.

REM --- Start Supabase containers ---
echo Starting Supabase services via Docker...
npx supabase start
if %errorlevel% neq 0 (
    echo   [ERROR] Failed to start Supabase.
    goto :eof
)
echo   [OK] Supabase services started.
echo.

REM --- Reset and seed the database ---
echo Resetting the local database and applying schema...
npx supabase db reset
if %errorlevel% neq 0 (
    echo   [ERROR] Failed to reset the database.
    goto :eof
)
echo   [OK] Database reset and seeded successfully.
echo.

echo ====================================================================
echo Project setup complete!
echo Starting the development server...
echo Visit http://localhost:3000 in your browser.
echo ====================================================================
echo.

REM --- Start the application ---
npm run dev

endlocal
:eof
