# SmartShop Backend - API E-commerce avec Moteur de Recommandation

## 🎯 Description

Backend Node.js/Express pour une application e-commerce avec un moteur de recommandation intelligent basé sur Neo4j.

## 🏗️ Architecture

### Services
- **ProductService** : Gestion des produits et catégories
- **OrderService** : Gestion des commandes
- **RecommendationService** : Moteur de recommandation intelligent

### Structure de la BD Neo4j
```
(:Order)-[:CONTAINS]->(:Product)
(:Product)-[:BELONGS_TO]->(:Category)
```

## 🚀 Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer les variables d'environnement
```bash
cp .env.example .env
```

Editer `.env` avec vos paramètres Neo4j :
```
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=votre_password
PORT=5000
```

### 3. Initialiser la base de données
```bash
node scripts/initDatabase.js
```

### 4. Démarrer le serveur
```bash
npm start
```

Pour le développement avec hot-reload :
```bash
npm run dev
```

## 📚 Endpoints API

### Produits
- `GET /api/products` - Récupérer tous les produits
- `GET /api/products/:id` - Récupérer un produit
- `POST /api/products` - Créer un produit
- `GET /api/products/:id/categories` - Catégories d'un produit
- `GET /api/categories/:name/products` - Produits d'une catégorie

### Commandes
- `GET /api/orders/:id` - Récupérer une commande
- `POST /api/orders` - Créer une commande
- `GET /api/orders/:id/products` - Produits d'une commande

### Recommandations
- `GET /api/recommendations/order/:orderId?limit=5` - Recommandations basées sur une commande
- `GET /api/recommendations/category/:name?limit=5` - Produits populaires dans une catégorie
- `POST /api/recommendations/basket` - Recommandations basées sur le panier
- `GET /api/recommendations/cobought/:productId?limit=5` - Produits co-achetés

## 📊 Exemples de requêtes

### Créer un produit
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"id":"P9","brand":"Dell","price":1200}'
```

### Créer une commande
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"id":"O6","productIds":["P1","P3","P5"]}'
```

### Recommandations du panier
```bash
curl -X POST http://localhost:5000/api/recommendations/basket \
  -H "Content-Type: application/json" \
  -d '{"productIds":["P1","P3"]}'
```

## 🔧 Développement

### Structure des fichiers
```
backend/
├── config/
│   ├── neo4j.js          # Configuration Neo4j
│   └── config.js         # Configuration générale
├── services/
│   ├── productService.js       # Service produits
│   ├── orderService.js         # Service commandes
│   └── recommendationService.js # Service recommandations
├── routes/
│   ├── products.js       # Routes produits
│   ├── orders.js         # Routes commandes
│   └── recommendations.js # Routes recommandations
├── scripts/
│   └── initDatabase.js   # Initialisation BD
├── server.js             # Point d'entrée
├── package.json          # Dépendances
└── .env                  # Variables d'environnement
```

## 🧪 Tests

```bash
npm test
```

## 📝 Notes

- Assurez-vous que Neo4j est en cours d'exécution sur le port spécifié
- Les mots de passe par défaut doivent être changés en production
- Voir `frontend/` pour l'interface utilisateur
