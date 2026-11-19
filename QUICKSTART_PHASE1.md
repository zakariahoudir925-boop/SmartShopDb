# 🚀 DÉMARRAGE RAPIDE - PHASE 1

> Pour tester immédiatement les améliorations

---

## ⚡ 5 ÉTAPES (10 minutes)

### 1️⃣ Vérifier les Prérequis (2 min)

```bash
# Neo4j doit être lancé
# Vérifier: http://localhost:7474

# Node.js/npm installés
node --version
npm --version
```

### 2️⃣ Charger les Données de Test (3 min)

1. Ouvrir **Neo4j Browser**: `http://localhost:7474`
2. Se connecter (user: `neo4j`, password: `password` par défaut)
3. Ouvrir le fichier: `SAMPLE_DATA_NEO4J.cypher`
4. **Copier tout le contenu**
5. Coller dans Neo4j Browser
6. Exécuter par section (⬆️ pour chaque requête)

**Ou directement avec cypher-shell**:
```bash
cypher-shell -u neo4j -p password < SAMPLE_DATA_NEO4J.cypher
```

### 3️⃣ Démarrer le Backend (2 min)

```bash
cd backend
npm install  # Si 1re fois
npm start
```

Vérifier: `🚀 SmartShop API running on port 5000`

### 4️⃣ Démarrer le Frontend (2 min)

**Ouvrir nouveau terminal**:
```bash
cd frontend
npm install  # Si 1re fois
npm start
```

Navigateur ouvre automatiquement: `http://localhost:3000`

### 5️⃣ Tester les Recommandations (1 min)

1. Vous êtes sur `http://localhost:3000`
2. Cliquez sur un produit pour l'ajouter au panier
3. **Attendez 1-2 sec** → Recommandations apparaissent
4. Vérifiez:
   - ✅ Champ "Souvent acheté avec..."
   - ✅ Score visible ("Score: X co-achats")
5. Ajoutez un 2e produit → scores se mettent à jour

---

## 📊 Vous Devez Voir:

### Interface Panier
```
🛒 Votre Panier
├─ Produit 1 - 1200€
└─ Produit 2 - 99€
Total: 1299€

💡 Produits Recommandés
├─ LG Screen - 399€
│  📊 Souvent acheté avec vos produits
│  Score: 45 co-achats
│  ➕ Ajouter
├─ Keyboard - 99€
│  ...
```

### Console Logs (F12)
```
🧠 Recommandations avancées pour panier: prod_laptop (limit: 5)
✅ 5 recommandations trouvées
```

---

## 🧪 Tests Rapides API

**Dans un autre terminal**:

```bash
# Test 1: Obtenir les produits
curl http://localhost:5000/api/products?limit=3

# Test 2: Recommandations pour 1 produit
curl -X POST http://localhost:5000/api/recommendations/basket/advanced \
  -H "Content-Type: application/json" \
  -d '{"basketIds": ["prod_laptop"]}'

# Test 3: Recommandations pour 2 produits
curl -X POST http://localhost:5000/api/recommendations/basket/advanced \
  -H "Content-Type: application/json" \
  -d '{"basketIds": ["prod_laptop", "prod_mouse"]}'
```

---

## ❓ Ça Ne Marche Pas?

### "Erreur de connexion Neo4j"
```
❌ Vérifier: Neo4j est lancé
✅ Solution: docker run ou installation locale
```

### "Pas de recommandations"
```
❌ Vérifier: Données importées? (SAMPLE_DATA_NEO4J.cypher)
✅ Solution: Relancer les requêtes dans Neo4j Browser
```

### "Erreur CORS"
```
❌ Vérifier: Backend sur port 5000
✅ Solution: Redémarrer backend (npm start)
```

### "Port déjà utilisé"
```
❌ Vérifier: Un autre processus sur le port
✅ Solution: 
   - Windows: netstat -ano | findstr :5000
   - Mac/Linux: lsof -i :5000
   Puis: kill -9 <PID>
```

---

## 📋 Checklist Avant Présentation

- [ ] Neo4j lancé
- [ ] Données importées (15 commandes, 10 produits)
- [ ] Backend: `npm start` ✓
- [ ] Frontend: `npm start` ✓
- [ ] `http://localhost:3000` accessible
- [ ] Produits apparaissent dans la liste
- [ ] Ajouter produit → recommandations apparaissent
- [ ] Console F12 → logs visibles
- [ ] Réponse API contient `score` et `reason`

---

## 🎯 Prochaines Actions

### Maintenant (5 min)
```
✅ Suivre ce guide (DÉMARRAGE RAPIDE)
✅ Vérifier que tout fonctionne
```

### Avant Présentation Jury (30 min)
```
📖 Lire: JURY_PRESENTATION_GUIDE.md
🎬 Préparer la démo (script 7 min)
🧪 Exécuter les requêtes Cypher (CYPHER_QUERIES_PHASE1.md)
```

### Documentation (1h optionnel)
```
📚 Lire PHASE_1_IMPROVEMENTS.md (détails)
🗺️ Lire ROADMAP_PHASE2.md (suite)
```

---

## 🔗 Ressources Rapides

| Resource | URL |
|----------|-----|
| Frontend | `http://localhost:3000` |
| Neo4j Browser | `http://localhost:7474` |
| API Health | `http://localhost:5000/health` |

| Fichier | Contenu |
|---------|---------|
| PHASE_1_IMPROVEMENTS.md | Détails PHASE 1 |
| CYPHER_QUERIES_PHASE1.md | Requêtes Cypher |
| JURY_PRESENTATION_GUIDE.md | Script présentation |
| TEST_PHASE1.bat | Tests automatisés |
| SAMPLE_DATA_NEO4J.cypher | Données de test |

---

## 💡 Pro Tips

1. **Gardez Neo4j Browser ouvert** pendant la démo
   - Utile pour montrer les requêtes

2. **Ayez DevTools ouverts** (F12)
   - Montrez les logs en temps réel

3. **Testez avant la présentation**
   - Mieux vaut découvrir les bugs maintenant

4. **Préparez un texte** (JURY_PRESENTATION_GUIDE.md)
   - 7 minutes de narration

5. **Ayez des screenshots** de secours
   - Au cas où ça crash (panique moins)

---

## ✨ Vous Êtes Prêt!

La PHASE 1 est fonctionnelle et prête pour présentation.

**Prochaine étape**: Lire `JURY_PRESENTATION_GUIDE.md` pour la démo.

---

**Temps Estimation**: 10-15 min pour démarrage
**Statut**: ✅ Prêt
**Questions?**: Voir README.md ou PHASE_1_IMPROVEMENTS.md

