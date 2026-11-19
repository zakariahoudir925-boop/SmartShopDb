#!/bin/bash

# SmartShop Setup Script
# Script d'installation pour SmartShop

set -e

echo "🛍️ Bienvenue dans SmartShop!"
echo "================================"

# Vérifier les prérequis
echo ""
echo "📋 Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi
echo "✅ npm $(npm -v)"

# Installer le backend
echo ""
echo "🔧 Installation du backend..."
cd backend
cp .env.example .env
npm install
echo "✅ Backend prêt"

# Installer le frontend
echo ""
echo "🎨 Installation du frontend..."
cd ../frontend
npm install
echo "✅ Frontend prêt"

echo ""
echo "✨ Installation terminée!"
echo ""
echo "🚀 Pour démarrer:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  node scripts/initDatabase.js  # Initialiser Neo4j"
echo "  npm start"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "L'application sera disponible sur http://localhost:3000"
