# 🛍️ SmartShop - Moteur de Recommandation E-commerce avec Neo4j

Bienvenue dans SmartShop! Une application e-commerce complète avec un moteur de recommandation intelligent basé sur la base de données graphique Neo4j.

## 🎯 Vue d'ensemble

SmartShop est une application fullstack moderne qui combine:
- **Backend**: Node.js/Express avec moteur de recommandation Neo4j
- **Frontend**: React avec interface utilisateur intuitive
- **Base de données**: Neo4j (graphique) pour les recommandations intelligentes

## 🏗️ Architecture

### Structure de la Base de Données Neo4j

```
(:Order)-[:CONTAINS]->(:Product)
(:Product)-[:BELONGS_TO]->(:Category)
```

**Nœuds:**
- `Order`: id
- `Product`: id, brand, price
- `Category`: name

## ⚡ Démarrage Rapide

### Option 1: Docker Compose (Recommandé)

```bash
# Cloner/accéder au projet
cd SmartShopDb

# Démarrer tous les services
docker-compose up

# L'application sera disponible sur:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000/api
# - Neo4j Browser: http://localhost:7474
```

### Option 2: Installation Locale

#### Prérequis
- Node.js 18+
- Neo4j 5+ en cours d'exécution

#### Backend

```bash
cd backend

# Configurer les variables d'environnement
cp .env.example .env
# Editer .env avec vos paramètres Neo4j

# Installer et démarrer
npm install
node scripts/initDatabase.js  # Initialiser la BD
npm start                      # Démarrer sur le port 5000
```

#### Frontend

```bash
cd frontend

# Installer et démarrer
npm install
npm start  # Démarrer sur le port 3000
```

## 🚀 Fonctionnalités

### 📦 Gestion des Produits
- Catalogue complet des produits
- Filtrage par catégorie
- Détails détaillés (marque, prix)

### 💡 Moteur de Recommandation
- **Co-achats**: Produits achetés ensemble
- **Panier Intelligent**: Recommandations basées sur les articles du panier
- **Catégories Populaires**: Produits tendance par catégorie
- **Historique**: Recommandations basées sur les commandes précédentes

### 🛒 Gestion du Panier
- Ajout/suppression dynamique
- Recommandations en temps réel
- Calcul du total

## 📚 Documentation Détaillée

### Backend
Voir [backend/README.md](./backend/README.md) pour:
- Liste complète des endpoints API
- Exemples de requêtes
- Configuration détaillée
- Architecture des services

### Frontend
Voir [frontend/README.md](./frontend/README.md) pour:
- Structure des composants
- Guide de développement
- Configuration personnalisée

## 🔌 Endpoints API Principaux

### Produits
```
GET    /api/products              # Tous les produits
GET    /api/products/:id          # Détails d'un produit
POST   /api/products              # Créer un produit
GET    /api/categories/:name/products  # Produits par catégorie
```

### Commandes
```
GET    /api/orders/:id            # Détails d'une commande
POST   /api/orders                # Créer une commande
GET    /api/orders/:id/products   # Produits d'une commande
```

### Recommandations
```
GET    /api/recommendations/order/:orderId          # Recommandations d'une commande
GET    /api/recommendations/category/:name          # Produits populaires
POST   /api/recommendations/basket                  # Recommandations du panier
GET    /api/recommendations/cobought/:productId     # Produits co-achetés
```

## 📊 Données Exemple

Le système s'initialise avec:
- **5 catégories**: Électronique, Mode, Sports, Maison, Livres
- **8 produits**: Samsung, Apple, Nike, Adidas, Sony, LG, Zara, H&M
- **5 commandes**: Avec relations CONTAINS

## 🛠️ Configuration

### Variables d'Environnement Backend

```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
PORT=5000
NODE_ENV=development
```

### Configuration Frontend

Dans `frontend/src/api.js`, modifier:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## 🌐 Requêtes Exemple

### Créer un produit
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "P9",
    "brand": "Dell",
    "price": 1200
  }'
```

### Obtenir des recommandations du panier
```bash
curl -X POST http://localhost:5000/api/recommendations/basket \
  -H "Content-Type: application/json" \
  -d '{"productIds": ["P1", "P3", "P5"]}'
```

### Voir les produits co-achetés
```bash
curl http://localhost:5000/api/recommendations/cobought/P1?limit=5
```

## 🔐 Sécurité

- Les connexions Neo4j utilisent l'authentification de base
- CORS est configuré sur le backend
- Validations d'entrée sur tous les endpoints

⚠️ **En production:**
- Changez les mots de passe Neo4j
- Utilisez des variables d'environnement sécurisées
- Activez HTTPS
- Configurez les règles CORS correctement

## 🧪 Tests

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📈 Améliorations Futures

- [ ] Authentification utilisateur
- [ ] Historique des commandes
- [ ] Évaluations et avis
- [ ] Recherche avancée
- [ ] Dashboard d'administration
- [ ] Analytics et statistiques
- [ ] Paiement intégré
- [ ] Notifications

## 🤝 Support

Pour toute question ou problème:
1. Vérifiez que Neo4j est bien connecté
2. Consultez les logs du backend: `npm start`
3. Vérifiez la configuration CORS
4. Testez les endpoints avec curl ou Postman

## 📄 Licences

- Neo4j Driver: Propriétaire
- Express: MIT
- React: MIT

## 👨‍💻 Développeur

Créé avec ❤️ pour les passionnés de e-commerce et de technologie graphique.

---

**Commencez maintenant avec Docker Compose:**
```bash
docker-compose up
```

Puis ouvrez http://localhost:3000 dans votre navigateur! 🚀
