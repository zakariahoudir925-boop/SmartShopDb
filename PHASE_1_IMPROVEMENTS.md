# 🎯 PHASE 1 : Améliorations du Moteur de Recommandation

> Finalisation et amélioration du système existant - Focus: CO_PURCHASED + Scoring

---

## 📋 Résumé des Modifications

### ✅ Fichiers Modifiés

1. **Backend: `recommendationService.js`**
   - ✨ Nouvelle méthode: `getAdvancedBasketRecommendations()`
   - Utilise les co-achats (CO_PURCHASED) comme signal principal
   - Scoring intelligible: `coFrequency + popularity`
   - Exclusion automatique des produits du panier

2. **Backend: `recommendations.js` (routes)**
   - ✨ Nouvel endpoint: `POST /api/recommendations/basket/advanced`
   - Accepte `{ basketIds }` au lieu de `{ productIds }`
   - Logging amélioré (console)

3. **Frontend: `api.js`**
   - ✨ Nouvelle méthode: `recommendationAPI.getByBasketAdvanced()`
   - Point d'entrée unique pour l'API avancée

4. **Frontend: `Basket.js` (React)**
   - ✨ Utilise `getByBasketAdvanced()` au lieu de `getByBasket()`
   - Affiche `reason` (explication) pour chaque recommandation
   - Affiche `score` (nombre de co-achats)

5. **Frontend: `Basket.css`**
   - ✨ Nouveaux styles pour `reason` et `score`
   - Design amélioré avec gradients
   - Hover effects pour meilleure UX

---

## 🔍 Algorithme Détaillé

### Requête Cypher (Neo4j)

```cypher
// Trouver les co-achats pour tous les produits du panier
MATCH (p1:Product)<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(p2:Product)
WHERE p1.id IN $basketIds AND p2.id NOT IN $basketIds

// Agréger les scores par produit recommandé
WITH p2, COUNT(DISTINCT o) as coFrequency

// Optionnels: obtenir plus d'info sur le produit
OPTIONAL MATCH (o_all:Order)-[:CONTAINS]->(p2)
WITH p2, coFrequency, COUNT(DISTINCT o_all) as totalPopularity

// Score final = combinaison de fréquence co-achat + popularité
RETURN p2.id as id, 
       p2.brand as brand, 
       p2.price as price,
       coFrequency as score,
       totalPopularity as popularity,
       'Souvent acheté avec vos produits' as reason

ORDER BY coFrequency DESC, totalPopularity DESC
LIMIT $limit
```

### Logique

| Étape | Description |
|-------|-------------|
| **1** | Pour chaque produit du panier (p1) |
| **2** | Trouvez toutes les commandes où il a été acheté |
| **3** | Pour chaque commande, trouvez les AUTRES produits (p2) |
| **4** | Comptez combien de fois p2 apparaît avec p1 → `coFrequency` |
| **5** | Comptez la popularité globale de p2 → `totalPopularity` |
| **6** | Excluez les produits déjà dans le panier |
| **7** | Ordonnez par coFrequency DESC (co-achats les plus fréquents) |

### Exemple Concret

Panier = [Laptop, Souris]

```
Laptop a été acheté 50 fois
  ├─ 30 fois avec Écran (30 co-achats)
  ├─ 25 fois avec Clavier (25 co-achats)
  └─ 10 fois avec Housse (10 co-achats)

Souris a été achetée 100 fois
  ├─ 40 fois avec Tapis (40 co-achats)
  ├─ 30 fois avec Écran (30 co-achats)
  └─ 15 fois avec Câble USB (15 co-achats)

Résultat AGRÉGÉ (pas de doublon) :
1️⃣ Écran    → 30 + 30 = 60 co-achats ⭐
2️⃣ Tapis    → 40 co-achats
3️⃣ Clavier  → 25 co-achats
4️⃣ Housse   → 10 co-achats
5️⃣ Câble USB → 15 co-achats
```

---

## 🚀 Comment Tester

### 1️⃣ Démarrer le Backend

```bash
cd backend
npm install
npm start
```

Vérifiez le message:
```
🚀 SmartShop API running on port 5000
```

### 2️⃣ Démarrer le Frontend

```bash
cd frontend
npm install
npm start
```

### 3️⃣ Tester dans le Navigateur

1. Allez à `http://localhost:3000`
2. Cliquez sur des produits pour les ajouter au panier
3. **Observez les recommandations dynamiques** :
   - `reason` : "Souvent acheté avec vos produits"
   - `score` : nombre de co-achats (ex: "Score: 30 co-achats")

### 4️⃣ Tester via API (curl)

```bash
# Recommandations avancées
curl -X POST http://localhost:5000/api/recommendations/basket/advanced \
  -H "Content-Type: application/json" \
  -d '{"basketIds": ["prod1", "prod2"]}' \
  -d '{"limit": 5}'

# Exemple de réponse :
{
  "success": true,
  "data": [
    {
      "id": "prod3",
      "brand": "Samsung",
      "price": 299,
      "score": 45,           ← Nombre de co-achats
      "popularity": 120,     ← Achats totaux
      "reason": "Souvent acheté avec vos produits"
    },
    ...
  ]
}
```

---

## 📊 Affichage Frontend

### Avant (PHASE 0)
```
💡 Produits Recommandés
┌─────────────┐
│ Samsung     │
│ 299€        │
│ Catégories communes: 2  ← Vague
│ ➕ Ajouter  │
└─────────────┘
```

### Après (PHASE 1) ✨
```
💡 Produits Recommandés
┌─────────────────────────┐
│ Samsung                 │
│ 299€                    │
│ 📊 Souvent acheté avec  │  ← Explication claire
│    vos produits         │
│ Score: 45 co-achats     │  ← Justification chiffrée
│ ➕ Ajouter              │
└─────────────────────────┘
```

---

## 💡 Points Clés pour le Jury

### Améliorations Apportées

✅ **Moteur plus intelligent** :
- Avant : recommandations basées sur les catégories (simple, peu pertinent)
- Après : recommandations basées sur les comportements d'achat réels (CO_PURCHASED)

✅ **Transparence** :
- Chaque recommandation est expliquée (`reason`)
- Chaque score est justifié (`score`: nombre de co-achats)

✅ **Exclusion des doublons** :
- Impossible de recommander un produit déjà dans le panier
- SQL: `WHERE p2.id NOT IN $basketIds`

✅ **Scalabilité** :
- Requête Cypher optimisée (pas de cartesian product)
- Agrégation efficace avec `WITH` et `COUNT(DISTINCT)`

✅ **Continuité** :
- Anciennes méthodes conservées (backward compatibility)
- Nouvelle méthode `getAdvancedBasketRecommendations()` côte à côte

### Données Affichées

```javascript
{
  id: "prod_id",        // Identifiant du produit
  brand: "Samsung",     // Marque (nom du produit)
  price: 299,           // Prix
  score: 45,            // ⭐ CO-ACHATS DIRECTS (clé PHASE 1)
  popularity: 120,      // Achats totaux
  reason: "Souvent acheté avec vos produits"  // Explication
}
```

---

## 🔧 Prochaines Étapes (PHASE 2)

Pour améliorer davantage sans refondre:

1. **Recherche textuelle** (`/api/products/search?q=...`)
   - Filtrage par brand avec CONTAINS

2. **Filtres** (`?minPrice=100&maxPrice=500&brands=Samsung`)
   - WHERE clauses dynamiques

3. **Suggestions contextuelles** (produit consulté → co-achats)
   - Réutiliser la même logique

---

## 📚 Fichiers de Référence

- Backend service: [services/recommendationService.js](services/recommendationService.js)
- Backend routes: [routes/recommendations.js](routes/recommendations.js)
- Frontend API: [src/api.js](src/api.js)
- Frontend panier: [src/components/Basket.js](src/components/Basket.js)
- Styling: [src/components/Basket.css](src/components/Basket.css)

---

## ⚡ Conseils de Présentation au Jury

### Narrative

> "SmartShop utilise **Neo4j pour analyser les patterns d'achat réels**. Quand un client ajoute des produits au panier, le système trouve les produits **fréquemment achetés ensemble** dans les commandes précédentes, pas juste par catégorie. Chaque recommandation est transparente : elle montre **pourquoi** elle est recommandée et **combien de fois** cette association a été observée."

### Démo Live

1. **Montrer le panier vide** → pas de recommandations
2. **Ajouter 1 produit** → recommandations basées sur ses co-achats
3. **Ajouter un 2e produit** → fusion intelligente des recommandations
4. **Montrer la console** (F12) → logs en temps réel
5. **Montrer la requête Cypher** dans Neo4j Browser

### Points Forts à Souligner

- ✅ **Algorithme basé sur les données réelles** (CO_PURCHASED)
- ✅ **Scalable** (pas de calcul lourd, juste des agrégations Neo4j)
- ✅ **Transparent** (utilisateur comprend pourquoi)
- ✅ **Extensible** (facile d'ajouter d'autres signaux)

---

## 🐛 Troubleshooting

### "Aucune recommandation n'apparaît"

**Cause 1**: Pas assez de données Co-PURCHASED dans Neo4j
```
Solution: Importez plus de commandes avec initDatabase.js
```

**Cause 2**: Les basketIds ne matchent pas les IDs produits
```
Solution: Vérifiez que basket[].id = product.id dans la DB
```

### "Erreur 500 dans les logs"

Vérifiez:
1. Neo4j est lancé (`http://localhost:7687`)
2. Les produits existent dans la DB
3. Les relations CONTAINS existent

---

## 📝 Notes Techniques

### Pourquoi `COUNT(DISTINCT o)` ?

Pour éviter de compter deux fois une même commande si un produit apparaît plusieurs fois.

### Pourquoi `toNumber()` en JavaScript ?

Neo4j retourne les entiers comme des objets Int64, il faut les convertir.

### Pourquoi pas de "rating" ou "views" ?

KISS principle. On focus sur ce qui existe : les données de co-achat réelles.

---

**Version**: PHASE 1 - v1.0
**Date**: Janvier 2026
**Status**: ✅ Prêt pour démo

