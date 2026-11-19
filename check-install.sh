#!/bin/bash
# SmartShop - Installation Checker
# Vérifie que tous les prérequis sont installés

set -e

echo "🔍 Vérification de l'environnement SmartShop"
echo "==========================================="
echo ""

# Vérifier Node.js
echo -n "📦 Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✅ $NODE_VERSION"
else
    echo "❌ Non installé"
    echo "   → Installer depuis: https://nodejs.org/"
    exit 1
fi

# Vérifier npm
echo -n "📦 npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✅ v$NPM_VERSION"
else
    echo "❌ Non installé"
    exit 1
fi

# Vérifier Docker (optionnel)
echo -n "🐳 Docker... "
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo "✅ $DOCKER_VERSION"
else
    echo "⚠️  Non installé (optionnel pour docker-compose)"
fi

# Vérifier Docker Compose
echo -n "🐳 Docker Compose... "
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo "✅ $COMPOSE_VERSION"
elif docker compose version &> /dev/null; then
    echo "✅ (commande: docker compose)"
else
    echo "⚠️  Non installé (optionnel)"
fi

# Vérifier Git
echo -n "📚 Git... "
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✅ $GIT_VERSION"
else
    echo "⚠️  Non installé (optionnel)"
fi

# Vérifier la structure du projet
echo ""
echo "📂 Structure du Projet"
echo "====================="

check_file() {
    if [ -f "$1" ]; then
        echo "  ✅ $1"
    else
        echo "  ❌ $1 - MANQUANT"
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo "  ✅ $1/"
    else
        echo "  ❌ $1/ - MANQUANT"
    fi
}

check_file "package.json" || echo "  (À la racine du backend)"
check_file "README.md"
check_file "QUICKSTART.md"
check_file "docker-compose.yml"
check_file "STRUCTURE.md"

check_dir "backend"
check_dir "frontend"

# Vérifier fichiers backend
echo ""
echo "🔧 Backend"
echo "=========="
check_file "backend/package.json"
check_file "backend/server.js"
check_file "backend/.env.example"
check_dir "backend/services"
check_dir "backend/routes"
check_dir "backend/config"

# Vérifier fichiers frontend
echo ""
echo "🎨 Frontend"
echo "==========="
check_file "frontend/package.json"
check_file "frontend/public/index.html"
check_dir "frontend/src"
check_dir "frontend/src/components"

# Résumé
echo ""
echo "📋 Résumé"
echo "========"
echo ""
echo "✅ Prérequis:"
echo "  • Node.js ${NODE_VERSION#v}"
echo "  • npm v$NPM_VERSION"
echo ""

if command -v docker &> /dev/null && (command -v docker-compose &> /dev/null || docker compose version &> /dev/null 2>&1); then
    echo "✅ Docker & Docker Compose installés"
    echo "   → Vous pouvez utiliser: docker-compose up"
    echo ""
else
    echo "⚠️  Docker non disponible"
    echo "   → Vous devrez installer les packages localement"
    echo "   → Ou installer Docker depuis: https://docker.com/"
    echo ""
fi

echo "🚀 Prêt à démarrer!"
echo ""
echo "Prochaines étapes:"
echo "1. Lire QUICKSTART.md"
echo "2. Exécuter: docker-compose up"
echo "   Ou: cd backend && npm install && npm start"
echo "3. Ouvrir: http://localhost:3000"
echo ""
