# SmartShop Frontend - Interface E-commerce

## 🎯 Description

Interface React pour l'application e-commerce SmartShop avec moteur de recommandation intelligent.

## 🎨 Fonctionnalités

- **Catalogue de Produits** : Affichage de tous les produits avec détails
- **Panier Intelligent** : Ajout/suppression de produits
- **Recommandations Dynamiques** : 
  - Produits co-achetés
  - Recommandations basées sur le panier
  - Produits populaires par catégorie
  
## 🚀 Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Démarrer le serveur de développement
```bash
npm start
```

L'application s'ouvrira sur `http://localhost:3000`

### 3. Construction pour la production
```bash
npm run build
```

## 📁 Structure des composants

```
src/
├── components/
│   ├── ProductList.js       # Affichage de tous les produits
│   ├── ProductCard.js       # Carte produit avec recommandations
│   ├── Basket.js            # Panier avec recommandations
│   └── *.css                # Styles spécifiques
├── api.js                   # Client API
├── App.js                   # Composant principal
├── App.css                  # Styles globaux
├── index.js                 # Point d'entrée
├── index.css                # Styles globaux
└── ...
```

## 🔌 API Backend

L'application communique avec le backend Node.js sur `http://localhost:5000/api`

Endpoints utilisés:
- `GET /products` - Tous les produits
- `GET /recommendations/cobought/:productId` - Produits co-achetés
- `POST /recommendations/basket` - Recommandations du panier

## 📱 Design Responsive

L'interface s'adapte à tous les appareils:
- Desktop: Grille 2 colonnes pour le panier et recommandations
- Mobile: Disposition verticale

## 🎯 Pages

### 📦 Produits
- Affiche tous les produits disponibles
- Chaque produit montre ses co-achats
- Navigation fluide vers le panier

### 🛒 Panier
- Gestion dynamique des articles
- Recommandations en temps réel basées sur le panier
- Affichage du total

## 🧪 Test

```bash
npm test
```

## 🛠️ Configuration

Par défaut, le frontend communique avec le backend sur `http://localhost:5000`

Pour changer le serveur, modifier `src/api.js`:
```javascript
const API_URL = 'votre-nouveau-url/api';
```

## 📝 Notes

- Assurez-vous que le backend (port 5000) est en cours d'exécution
- CORS est activé sur le backend
- Les appels API sont asynchrones avec gestion d'erreur
