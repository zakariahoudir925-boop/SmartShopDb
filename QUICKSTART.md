# 🚀 SmartShop - Guide de Démarrage Rapide

## ⚡ Démarrage en 3 minutes

### Prérequis
- **Node.js 18+** et npm
- **Neo4j 5+** en cours d'exécution (en local ou Docker)
- **Docker + Docker Compose** (optionnel, mais recommandé)

---

## Option 1️⃣ : Démarrage avec Docker (Recommandé)

C'est le plus simple! Tout est conteneurisé.

```bash
# Dans le répertoire SmartShopDb
docker-compose up

# Attendez que tous les services démarrent...
# ✅ Neo4j prêt
# ✅ Backend API prêt (port 5000)
# ✅ Frontend prêt (port 3000)
```

L'application s'ouvrira automatiquement sur:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Neo4j Browser**: http://localhost:7474 (user: neo4j, password: password)

---

## Option 2️⃣ : Démarrage Manuel (Local)

### Étape 1: Préparer l'Environnement

**Windows:**
```cmd
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Étape 2: Démarrer le Backend

```bash
cd backend

# Configurer Neo4j (si besoin)
# Editer .env avec vos paramètres

# Initialiser la base de données
node scripts/initDatabase.js

# Démarrer le serveur
npm start
```

Vous verrez:
```
🚀 SmartShop API running on port 5000
📊 Neo4j connected to bolt://localhost:7687
```

### Étape 3: Démarrer le Frontend

**Dans un nouveau terminal:**

```bash
cd frontend
npm start
```

L'application s'ouvrira sur http://localhost:3000

---

## 🧪 Tester l'API

### Option A: Avec Postman

1. Ouvrir Postman
2. Importer la collection: `SmartShop.postman_collection.json`
3. Définir la variable `base_url` = `http://localhost:5000`
4. Commencer à tester!

### Option B: Avec curl

**Récupérer tous les produits:**
```bash
curl http://localhost:5000/api/products
```

**Obtenir des recommandations:**
```bash
curl -X POST http://localhost:5000/api/recommendations/basket \
  -H "Content-Type: application/json" \
  -d '{"productIds":["P1","P3"]}'
```

**Créer une commande:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"id":"O7","productIds":["P2","P4","P6"]}'
```

---

## 🎯 Fonctionnalités à Essayer

### 1️⃣ Page Produits
- ✅ Voir tous les produits
- ✅ Cliquer sur un produit pour voir les co-achats
- ✅ Ajouter des produits au panier

### 2️⃣ Panier Intelligent
- ✅ Voir les produits du panier
- ✅ Les recommandations se mettent à jour en temps réel
- ✅ Supprimer des articles

### 3️⃣ Moteur de Recommandation
- **Co-achats**: Produits souvent achetés ensemble
- **Catégories similaires**: Basées sur le contenu du panier
- **Popularité**: Produits à la mode par catégorie

---

## 🔧 Configuration

### Variables d'Environnement Backend

Éditer `backend/.env`:

```env
# Connexion Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Serveur
PORT=5000
NODE_ENV=development
```

### URL API Frontend

Éditer `frontend/src/api.js` si le backend est ailleurs:

```javascript
const API_URL = 'http://votre-serveur:5000/api';
```

---

## 📊 Données Initiales

L'initialisation crée automatiquement:

**5 Catégories:**
- Électronique
- Mode
- Sports
- Maison
- Livres

**8 Produits:**
- P1: Samsung (Électronique) - 899€
- P2: Apple (Électronique) - 1099€
- P3: Nike (Sports) - 120€
- P4: Adidas (Sports) - 100€
- P5: Sony (Électronique) - 799€
- P6: LG (Électronique) - 699€
- P7: Zara (Mode) - 79€
- P8: H&M (Mode) - 49€

**5 Commandes** avec relations CONTAINS

---

## ❌ Troubleshooting

### ❌ "Cannot connect to Neo4j"

```bash
# Vérifier que Neo4j fonctionne
docker ps | grep neo4j

# Ou démarrer Neo4j localement:
# Windows: C:\Program Files\Neo4j\bin\neo4j.bat console
# Mac/Linux: /usr/local/bin/neo4j console
```

### ❌ "Port 5000/3000 already in use"

```bash
# Trouver et arrêter le processus
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>
```

### ❌ "npm install fails"

```bash
# Nettoyer le cache npm
npm cache clean --force

# Réinstaller
npm install
```

### ❌ "CORS error"

Le backend doit avoir CORS activé (c'est le cas par défaut).
Vérifier que le frontend accède au bon URL du backend.

---

## 🚀 Prochaines Étapes

Après le démarrage:

1. **Consulter la documentation:**
   - [backend/README.md](./backend/README.md) - API complète
   - [frontend/README.md](./frontend/README.md) - Architecture React
   - [GUIDE_AVANCE.md](./GUIDE_AVANCE.md) - Concepts avancés

2. **Explorer le code:**
   - Services de recommandation: `backend/services/`
   - Composants React: `frontend/src/components/`
   - Requêtes Cypher: Voir dans `backend/services/`

3. **Personnaliser:**
   - Ajouter plus de produits
   - Créer de nouvelles catégories
   - Implémenter des filtres de prix
   - Ajouter l'authentification utilisateur

4. **Déployer:**
   - Avec Docker Compose en production
   - Sur Heroku, AWS, ou Azure
   - Voir les Dockerfiles inclus

---

## 📞 Support

**Questions sur Neo4j?**
- [Documentation Neo4j](https://neo4j.com/docs/)
- [Cypher Query Language](https://neo4j.com/docs/cypher-manual/)

**Questions sur le Code?**
- Lire les commentaires dans les services
- Consulter le GUIDE_AVANCE.md
- Vérifier les tests (si disponibles)

---

## 🎉 C'est parti!

```bash
# Démarrage rapide en une ligne (Docker):
docker-compose up

# Ou manuellement:
# Terminal 1:
cd backend && npm install && node scripts/initDatabase.js && npm start

# Terminal 2:
cd frontend && npm install && npm start
```

**Ouvrez votre navigateur sur http://localhost:3000 et commencez à explorez SmartShop!** 🛍️

---

**Bon développement!** 💻✨
