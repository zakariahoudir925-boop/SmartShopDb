# 📁 Structure du Projet SmartShop

```
SmartShopDb/
│
├── 📄 README.md                          # Documentation principale
├── 📄 QUICKSTART.md                      # Guide de démarrage rapide ⭐
├── 📄 GUIDE_AVANCE.md                    # Guide avancé et optimisations
├── 📄 docker-compose.yml                 # Configuration Docker (tous les services)
├── 📄 .gitignore                         # Fichiers à ignorer
├── 📄 SmartShop.postman_collection.json  # Collection pour tester l'API
│
├── 🔧 setup.sh                           # Script d'installation (Mac/Linux)
├── 🔧 setup.bat                          # Script d'installation (Windows)
│
├── 📂 backend/                           # Application Node.js/Express
│   ├── 📄 server.js                      # Point d'entrée principal
│   ├── 📄 package.json                   # Dépendances et scripts
│   ├── 📄 Dockerfile                     # Image Docker
│   ├── 📄 .env.example                   # Variables d'environnement
│   ├── 📄 README.md                      # Documentation backend
│   │
│   ├── 📂 config/                        # Configuration
│   │   ├── neo4j.js                      # Driver Neo4j
│   │   └── config.js                     # Configuration générale
│   │
│   ├── 📂 services/                      # Logique métier
│   │   ├── productService.js             # Gestion des produits
│   │   ├── orderService.js               # Gestion des commandes
│   │   └── recommendationService.js      # 🎯 Moteur de recommandation
│   │
│   ├── 📂 routes/                        # Routes API
│   │   ├── products.js                   # Endpoints produits
│   │   ├── orders.js                     # Endpoints commandes
│   │   └── recommendations.js            # Endpoints recommandations
│   │
│   └── 📂 scripts/                       # Scripts utilitaires
│       └── initDatabase.js               # Initialisation BD Neo4j
│
└── 📂 frontend/                          # Application React
    ├── 📄 package.json                   # Dépendances et scripts
    ├── 📄 Dockerfile                     # Image Docker (multi-stage)
    ├── 📄 README.md                      # Documentation frontend
    │
    ├── 📂 public/
    │   └── index.html                    # HTML principal
    │
    └── 📂 src/                           # Code source React
        ├── 📄 index.js                   # Point d'entrée
        ├── 📄 index.css                  # Styles globaux
        ├── 📄 App.js                     # Composant racine avec navigation
        ├── 📄 App.css                    # Styles App
        ├── 📄 api.js                     # Client API (fetch)
        │
        └── 📂 components/                # Composants réutilisables
            ├── ProductList.js            # Liste de tous les produits
            ├── ProductList.css           # Styles ProductList
            ├── ProductCard.js            # Carte produit individuelle
            ├── ProductCard.css           # Styles ProductCard
            ├── Basket.js                 # Panier et recommandations
            └── Basket.css                # Styles Basket
```

## 🔑 Fichiers Importants à Connaître

### Pour Démarrer
- **QUICKSTART.md** ⭐ - Lisez ça en premier!
- **docker-compose.yml** - Tout lancer en une commande
- **setup.sh / setup.bat** - Installation automatique

### Documentation
- **README.md** - Vue d'ensemble complète
- **backend/README.md** - API et endpoints
- **frontend/README.md** - Architecture React
- **GUIDE_AVANCE.md** - Concepts avancés et optimisations

### Code Principal
- **backend/server.js** - Serveur Express
- **backend/services/recommendationService.js** - Cœur du moteur
- **frontend/src/App.js** - Composant principal React

### Configuration
- **backend/.env.example** - Variables backend
- **docker-compose.yml** - Services Docker

---

## 🔄 Flux de Données

```
Frontend (React)
    ↓
api.js (Client HTTP)
    ↓
Backend API (Express)
    ├── routes/ (Endpoints)
    ├── services/ (Logique)
    └── config/neo4j.js
    ↓
Neo4j (Base de données graphique)
    ├── :Order nodes
    ├── :Product nodes
    ├── :Category nodes
    └── Relations [:CONTAINS], [:BELONGS_TO]
```

---

## 📊 Architecture par Composant

### Backend Services
```
ProductService
├── getAllProducts()
├── getProductById(id)
├── createProduct(id, brand, price)
├── getProductCategories(id)
└── getProductsByCategory(name)

OrderService
├── getOrder(id)
├── createOrder(id, productIds)
└── getOrderProducts(id)

RecommendationService ⭐ (Le cœur!)
├── getRecommendationsByOrder(orderId)
├── getPopularProductsByCategory(category)
├── getBasketRecommendations(productIds)
└── getCoBoughtProducts(productId)
```

### Frontend Components
```
App (Navigation)
├── ProductList (Page Produits)
│   └── ProductCard (Card individuelle)
│       ├── Affiche le produit
│       └── Chargement des co-achats
│
└── Basket (Page Panier)
    ├── Affichage du panier
    └── Recommandations dynamiques
```

---

## 🔌 Endpoints API

### Produits
- `GET /api/products` - Tous
- `GET /api/products/:id` - Un seul
- `POST /api/products` - Créer
- `GET /api/products/:id/categories` - Catégories

### Commandes
- `GET /api/orders/:id` - Détails
- `POST /api/orders` - Créer
- `GET /api/orders/:id/products` - Produits

### Recommandations 🎯
- `GET /api/recommendations/order/:orderId` - Par commande
- `GET /api/recommendations/category/:name` - Populaires
- `POST /api/recommendations/basket` - Du panier
- `GET /api/recommendations/cobought/:productId` - Co-achats

---

## 💾 Structure Neo4j

```cypher
// Nœuds
(:Order {id})
(:Product {id, brand, price})
(:Category {name})

// Relations
(:Order)-[:CONTAINS]->(:Product)
(:Product)-[:BELONGS_TO]->(:Category)

// Exemple de graphe
(O1)-[:CONTAINS]-(P1)-[:BELONGS_TO]-(Électronique)
            ↓
          (P2)-[:BELONGS_TO]-(Mode)
```

---

## 🚀 Commandes Utiles

```bash
# Démarrage
docker-compose up                          # Tout
cd backend && npm install && npm start     # Backend seul
cd frontend && npm install && npm start    # Frontend seul

# Tests
cd backend && npm test                     # Tests backend
cd frontend && npm test                    # Tests frontend

# Initialisation BD
node backend/scripts/initDatabase.js       # Réinitialiser Neo4j

# Développement
cd backend && npm run dev                  # Backend avec hot-reload
cd frontend && npm start                   # Frontend (hot-reload auto)
```

---

## 📱 Points d'Accès

| Service | URL | Identifiant |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| Backend API | http://localhost:5000 | - |
| Neo4j Browser | http://localhost:7474 | neo4j / password |
| Health Check | http://localhost:5000/health | - |

---

## ✅ Checklist pour Débuter

- [ ] Lire QUICKSTART.md
- [ ] Installer Node.js 18+
- [ ] Installer Docker (optionnel)
- [ ] Cloner/accéder au projet
- [ ] Exécuter `docker-compose up` ou les installations manuelles
- [ ] Ouvrir http://localhost:3000
- [ ] Tester les fonctionnalités
- [ ] Lire le code pour comprendre
- [ ] Consulter GUIDE_AVANCE.md pour les extensions

---

## 🎓 Apprendre Plus

1. **Moteur de Recommandation**: Voir `backend/services/recommendationService.js`
2. **Requêtes Neo4j**: Voir les `session.run()` dans les services
3. **API REST**: Voir `backend/routes/`
4. **Composants React**: Voir `frontend/src/components/`
5. **Concepts Avancés**: Lire `GUIDE_AVANCE.md`

---

Vous avez maintenant la carte complète du projet! 🗺️
