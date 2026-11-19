#!/bin/bash
# SmartShop - Afficher un résumé du projet

cat << "EOF"

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🛍️  SMARTSHOP - E-COMMERCE AVEC NEO4J                    ║
║   Moteur de Recommandation Intelligent                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

📋 STRUCTURE DU PROJET
├─ Backend (Node.js/Express)
│  └─ Moteur de recommandation Neo4j
├─ Frontend (React)
│  └─ Interface utilisateur moderne
└─ Orchestration (Docker Compose)
   └─ Déploiement simplifié

🚀 DÉMARRAGE RAPIDE
┌─────────────────────────────────────────────────────┐
│ Lancer: docker-compose up                           │
│ Puis:   http://localhost:3000                       │
│ API:    http://localhost:5000/api                   │
│ DB:     http://localhost:7474 (neo4j)               │
└─────────────────────────────────────────────────────┘

📚 DOCUMENTATION CLÉS
├─ QUICKSTART.md ⭐          (Démarrage en 3 minutes)
├─ STRUCTURE.md               (Carte complète du projet)
├─ backend/README.md          (API et endpoints)
├─ frontend/README.md         (Architecture React)
└─ GUIDE_AVANCE.md            (Concepts avancés)

🎯 MOTEUR DE RECOMMANDATION
├─ Co-achats              (Produits achetés ensemble)
├─ Recommandations Panier (Articles similaires)
├─ Catégories Populaires  (Tendances par catégorie)
└─ Historique Commandes   (Basé sur achats précédents)

🔌 API PRINCIPALE
├─ POST   /api/recommendations/basket        💡
├─ GET    /api/recommendations/cobought/:id  🛒
├─ GET    /api/recommendations/order/:id     📦
└─ + 10 autres endpoints...

🗄️  NEO4J GRAPHE
Order ─CONTAINS→ Product ─BELONGS_TO→ Category

📁 FICHIERS IMPORTANTS
│
├─ backend/
│  ├─ services/recommendationService.js    ⭐ Le cœur
│  ├─ server.js
│  └─ scripts/initDatabase.js
│
├─ frontend/
│  ├─ src/components/
│  │  ├─ ProductList.js
│  │  ├─ ProductCard.js
│  │  └─ Basket.js
│  └─ src/api.js
│
└─ docker-compose.yml                      🐳 Magic!

🛠️  TECHNOLOGIES
├─ Node.js 18+
├─ Express.js
├─ Neo4j Driver
├─ React 18+
├─ Docker
└─ Cypher Query Language

✨ FONCTIONNALITÉS
✅ Catalogue complet
✅ Panier intelligent
✅ Recommandations en temps réel
✅ Interface responsive
✅ API REST complète
✅ Containerisé

📊 DONNÉES INITIALES
├─ 5 catégories
├─ 8 produits
├─ 5 commandes
└─ Prêt à étendre!

🌐 ACCÈS
├─ Frontend:      http://localhost:3000
├─ API:           http://localhost:5000/api
├─ Neo4j Browser: http://localhost:7474
│  Identifiant:   neo4j
│  Mot de passe:  password
└─ Postman:       Importer SmartShop.postman_collection.json

🎓 PROCHAINES ÉTAPES
1️⃣  Lire QUICKSTART.md
2️⃣  Démarrer avec docker-compose up
3️⃣  Explorer http://localhost:3000
4️⃣  Tester les recommandations
5️⃣  Lire GUIDE_AVANCE.md pour les extensions
6️⃣  Personnaliser selon vos besoins

🚀 COMMANDES ESSENTIELLES

Démarrage:
  docker-compose up                      # Tout à la fois
  
Backend seul:
  cd backend
  npm install
  node scripts/initDatabase.js
  npm start
  
Frontend seul:
  cd frontend
  npm install
  npm start
  
Tests:
  cd backend && npm test
  cd frontend && npm test

💡 PETITS TRUCS UTILES
├─ Modifier .env pour changer BD
├─ Relancer initDatabase.js pour réinitialiser
├─ Les recommandations se mettent à jour en temps réel
├─ Ajouter plus de produits via POST /api/products
└─ Explorer Neo4j Browser pour voir le graphe

🐛 TROUBLESHOOTING
❌ Port occupé?        → Arrêter le processus sur ce port
❌ Neo4j non trouvé?   → Vérifier que Docker fonctionne
❌ CORS error?         → Backend doit avoir CORS activé ✅
❌ npm install échoue? → npm cache clean --force

📞 SUPPORT
├─ README.md principal
├─ Documentations spécifiques par dossier
├─ Code commenté
└─ GUIDE_AVANCE.md pour concepts avancés

🎉 BON DÉVELOPPEMENT!

  ✨ Pour commencer immédiatement:
     docker-compose up
     
  🌐 Puis ouvrez:
     http://localhost:3000

═════════════════════════════════════════════════════════════════

         Créé avec ❤️ pour les amateurs de e-commerce
                et de bases de données graphiques

═════════════════════════════════════════════════════════════════

EOF
