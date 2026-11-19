@echo off
REM SmartShop - Installation Checker for Windows
REM Vérifie que tous les prérequis sont installés

cls
echo.
echo 🔍 Verification de l'environnement SmartShop
echo ===========================================
echo.

REM Vérifier Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node.js installed
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo    Version: %NODE_VERSION%
) else (
    echo ❌ Node.js not found
    echo    Install from: https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier npm
echo.
echo Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ npm installed
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo    Version: %NPM_VERSION%
) else (
    echo ❌ npm not found
    pause
    exit /b 1
)

REM Vérifier Docker
echo.
echo Checking Docker...
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker installed
) else (
    echo ⚠️ Docker not found (optional)
)

REM Vérifier Docker Compose
echo.
echo Checking Docker Compose...
where docker-compose >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker Compose installed
) else (
    docker compose version >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Docker Compose installed
    ) else (
        echo ⚠️ Docker Compose not found (optional)
    )
)

REM Vérifier Git
echo.
echo Checking Git...
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Git installed
) else (
    echo ⚠️ Git not found (optional)
)

REM Vérifier fichiers
echo.
echo 📂 Structure du Projet
echo =====================
echo.

if exist "README.md" (
    echo ✅ README.md
) else (
    echo ❌ README.md - MANQUANT
)

if exist "QUICKSTART.md" (
    echo ✅ QUICKSTART.md
) else (
    echo ❌ QUICKSTART.md - MANQUANT
)

if exist "docker-compose.yml" (
    echo ✅ docker-compose.yml
) else (
    echo ❌ docker-compose.yml - MANQUANT
)

if exist "backend\" (
    echo ✅ backend\
) else (
    echo ❌ backend\ - MANQUANT
)

if exist "frontend\" (
    echo ✅ frontend\
) else (
    echo ❌ frontend\ - MANQUANT
)

echo.
echo 📋 Résumé
echo ========
echo.

echo ✅ Prérequis:
echo   • Node.js %NODE_VERSION%
echo   • npm %NPM_VERSION%
echo.

where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker est disponible
    echo    → Vous pouvez utiliser: docker-compose up
) else (
    echo ⚠️ Docker n'est pas disponible
    echo    → Vous devrez installer les packages localement
    echo    → Ou installer Docker depuis: https://docker.com/
)

echo.
echo 🚀 Prêt à démarrer!
echo.
echo Prochaines étapes:
echo 1. Lire QUICKSTART.md
echo 2. Exécuter: docker-compose up
echo    Ou: cd backend && npm install && npm start
echo 3. Ouvrir: http://localhost:3000
echo.
pause
