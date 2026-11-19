@echo off
REM SmartShop Setup Script for Windows
REM Script d'installation pour SmartShop

echo 🛍️ Bienvenue dans SmartShop!
echo ================================

REM Vérifier Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js n'est pas installé. Veuillez installer Node.js 18+
    pause
    exit /b 1
)
echo ✅ Node.js is installed

REM Vérifier npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm n'est pas installé
    pause
    exit /b 1
)
echo ✅ npm is installed

REM Installer le backend
echo.
echo 🔧 Installation du backend...
cd backend
copy .env.example .env >nul
call npm install
echo ✅ Backend prêt

REM Installer le frontend
echo.
echo 🎨 Installation du frontend...
cd ..\frontend
call npm install
echo ✅ Frontend prêt

cd ..

echo.
echo ✨ Installation terminée!
echo.
echo 🚀 Pour démarrer:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   node scripts/initDatabase.js  ^(Initialiser Neo4j^)
echo   npm start
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm start
echo.
echo L'application sera disponible sur http://localhost:3000
pause
