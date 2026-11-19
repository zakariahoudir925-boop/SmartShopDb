@echo off
REM SmartShop - Afficher les informations du projet

cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║   🛍️  SMARTSHOP - E-COMMERCE AVEC NEO4J                    ║
echo ║   Moteur de Recommandation Intelligent                     ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 📋 STRUCTURE DU PROJET
echo ├─ Backend (Node.js/Express)
echo │  └─ Moteur de recommandation Neo4j
echo ├─ Frontend (React)
echo │  └─ Interface utilisateur moderne
echo └─ Orchestration (Docker Compose)
echo    └─ Déploiement simplifié
echo.
echo 🚀 DÉMARRAGE RAPIDE
echo ┌─────────────────────────────────────────────────────┐
echo │ Lancer: docker-compose up                           │
echo │ Puis:   http://localhost:3000                       │
echo │ API:    http://localhost:5000/api                   │
echo │ DB:     http://localhost:7474 (neo4j)               │
echo └─────────────────────────────────────────────────────┘
echo.
echo 📚 DOCUMENTATION CLÉS
echo ├─ QUICKSTART.md ⭐          (Démarrage en 3 minutes)
echo ├─ STRUCTURE.md               (Carte complète du projet)
echo ├─ backend/README.md          (API et endpoints)
echo ├─ frontend/README.md         (Architecture React)
echo └─ GUIDE_AVANCE.md            (Concepts avancés)
echo.
echo 🎯 MOTEUR DE RECOMMANDATION
echo ├─ Co-achats              (Produits achetés ensemble)
echo ├─ Recommandations Panier (Articles similaires)
echo ├─ Catégories Populaires  (Tendances par catégorie)
echo └─ Historique Commandes   (Basé sur achats précédents)
echo.
echo 🌐 ACCÈS
echo ├─ Frontend:      http://localhost:3000
echo ├─ API:           http://localhost:5000/api
echo ├─ Neo4j Browser: http://localhost:7474
echo │  Identifiant:   neo4j
echo │  Mot de passe:  password
echo └─ Postman:       Importer SmartShop.postman_collection.json
echo.
echo 🚀 COMMANDES ESSENTIELLES
echo.
echo Démarrage complet:
echo   docker-compose up
echo.
echo Backend seul:
echo   cd backend
echo   npm install
echo   node scripts\initDatabase.js
echo   npm start
echo.
echo Frontend seul:
echo   cd frontend
echo   npm install
echo   npm start
echo.
echo 🎉 BON DÉVELOPPEMENT!
echo.
echo   ✨ Pour commencer immédiatement:
echo      docker-compose up
echo.
echo   🌐 Puis ouvrez:
echo      http://localhost:3000
echo.
pause
