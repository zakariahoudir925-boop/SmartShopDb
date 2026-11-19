# SmartShop - Commandes Utiles

Voici un fichier de référence avec toutes les commandes utiles pour développer SmartShop.

## 🚀 Démarrage

### Docker (Recommandé)
```bash
# Tout démarrer
docker-compose up

# En arrière-plan
docker-compose up -d

# Arrêter tous les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f neo4j
```

### Installation Manuelle
```bash
# Backend
cd backend
cp .env.example .env
npm install
node scripts/initDatabase.js
npm start

# Frontend (dans un autre terminal)
cd frontend
npm install
npm start
```

## 🔧 Développement

### Backend
```bash
cd backend

# Démarrage avec hot-reload (si nodemon est installé)
npm run dev

# Démarrage normal
npm start

# Tests
npm test

# Linting (si eslint est configuré)
npm run lint

# Réinitialiser la BD
node scripts/initDatabase.js
```

### Frontend
```bash
cd frontend

# Démarrage (avec hot-reload automatique)
npm start

# Build pour production
npm run build

# Tests
npm test

# Éjecter la configuration (attention: irréversible)
npm run eject
```

## 🧪 Tests

```bash
# Tout tester
cd backend && npm test
cd frontend && npm test

# Tester un fichier spécifique
npm test -- ProductService.test.js

# Coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

## 🐳 Docker

```bash
# Construire les images
docker build -t smartshop-backend ./backend
docker build -t smartshop-frontend ./frontend

# Voir les images
docker images | grep smartshop

# Voir les conteneurs
docker ps

# Logs d'un conteneur
docker logs -f smartshop-backend

# Exécuter une commande dans un conteneur
docker exec -it smartshop-backend npm test

# Nettoyer
docker system prune
```

## 📦 Gestion des Dépendances

### Node.js/npm
```bash
# Installer des dépendances
npm install

# Ajouter une nouvelle dépendance
npm install --save package-name

# Ajouter une dépendance de développement
npm install --save-dev package-name

# Mettre à jour les dépendances
npm update

# Voir les outdated packages
npm outdated

# Auditer les vulnérabilités
npm audit
npm audit fix
```

## 📊 Neo4j

### Avec Docker
```bash
# Accéder au Neo4j Browser
# http://localhost:7474
# User: neo4j
# Password: password (ou le vôtre)

# Exécuter des requêtes via la CLI
docker exec -it smartshop-neo4j cypher-shell

# Backup
docker exec smartshop-neo4j neo4j-admin database dump neo4j backup.dump
```

### Requêtes Cypher Utiles
```cypher
# Voir tous les nœuds
MATCH (n) RETURN n;

# Voir toutes les relations
MATCH (n)-[r]->(m) RETURN n, r, m;

# Compter les produits
MATCH (p:Product) RETURN COUNT(p);

# Compter les commandes
MATCH (o:Order) RETURN COUNT(o);

# Voir la structure
CALL db.schema.visualization();

# Réinitialiser (ATTENTION!)
MATCH (n) DETACH DELETE n;
```

## 🔍 Debugging

### Backend
```bash
# Avec debugger Node.js
node inspect backend/server.js

# Avec VS Code (ajouter à .vscode/launch.json)
"launch": {
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/backend/server.js"
}
```

### Frontend
```bash
# Chrome DevTools (F12)
# - Onglet Console pour les logs
# - Onglet Network pour les requêtes API
# - Onglet Sources pour déboguer

# React DevTools
# Extension: React Developer Tools (Chrome/Firefox)
```

## 🌐 API

### Tester avec curl
```bash
# Santé
curl http://localhost:5000/health

# Produits
curl http://localhost:5000/api/products
curl http://localhost:5000/api/products/P1

# Créer un produit
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"id":"P99","brand":"Test","price":999}'

# Recommandations
curl -X POST http://localhost:5000/api/recommendations/basket \
  -H "Content-Type: application/json" \
  -d '{"productIds":["P1","P3"]}'
```

### Avec Postman
1. Importer: `SmartShop.postman_collection.json`
2. Définir variable: `base_url = http://localhost:5000`
3. Cliquer sur les requêtes

### Avec VS Code REST Client
```bash
# Installer l'extension REST Client
# Créer un fichier .http ou .rest

### Get all products
GET http://localhost:5000/api/products

### Create product
POST http://localhost:5000/api/products
Content-Type: application/json

{
  "id": "P99",
  "brand": "Test",
  "price": 999
}
```

## 📝 Logs et Monitoring

```bash
# Voir les logs en temps réel
docker-compose logs -f

# Sauvegarder les logs
docker-compose logs > logs.txt

# Voir les ressources utilisées
docker stats

# Voir les volumes
docker volume ls
```

## 🔄 Git

```bash
# Vérifier l'état
git status

# Ajouter les changements
git add .

# Commit
git commit -m "feat: description du changement"

# Push
git push origin feature-branch

# Créer une pull request
# (Via GitHub interface)

# Mettre à jour depuis le remote
git pull origin main
```

## 🧹 Nettoyage

```bash
# Supprimer node_modules
rm -rf backend/node_modules frontend/node_modules

# Nettoyer le cache npm
npm cache clean --force

# Supprimer les conteneurs
docker-compose down

# Supprimer les volumes
docker volume rm smartshop_neo4j_data

# Supprimer les images
docker rmi smartshop-backend smartshop-frontend
```

## 📋 Vérifications Avant Push

```bash
# Linting
npm run lint

# Tests
npm test

# Build
npm run build

# Docker compose
docker-compose up --abort-on-container-exit

# Vérifier que tout fonctionne
curl http://localhost:5000/health
curl http://localhost:3000
```

## 🎯 Workflow Typique

```bash
# 1. Créer une branche
git checkout -b feature/ma-feature

# 2. Démarrer le projet
docker-compose up

# 3. Développer dans VS Code
# ...

# 4. Tester
npm test
docker-compose logs

# 5. Commit
git add .
git commit -m "feat: ma nouvelle feature"

# 6. Push
git push origin feature/ma-feature

# 7. Créer PR sur GitHub
```

## 📚 Ressources

- [Node.js Docs](https://nodejs.org/docs/)
- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Neo4j Docs](https://neo4j.com/docs/)
- [Docker Docs](https://docs.docker.com/)

---

**Besoin d'aide?** Consulte README.md ou GUIDE_AVANCE.md
