# 🚀 ROADMAP PHASE 2 - SmartShop

> Prochaines améliorations après PHASE 1 validée

---

## 📌 Vue d'Ensemble

**PHASE 1 (FAIT ✅)** : Recommandations CO_PURCHASED basique
- Algorithme: co-achats directs avec scoring
- Exclusion produits panier
- Affichage raison + score

**PHASE 2 (À FAIRE)** : Fonctionnalités e-commerce classiques
- Recherche textuelle
- Filtres (prix, marque, catégorie)
- Suggestions contextuelles
- Amélioration scoring

**PHASE 3 (OPTIONNEL)** : Analytics & Intelligence
- Dashboard stats
- Exportation recommandations
- A/B testing
- Trending products

---

## 2.1 RECHERCHE TEXTUELLE

### Objectif
Permettre aux utilisateurs de chercher des produits par nom/marque

### Endpoint
```
GET /api/products/search?q=samsung&limit=10
```

### Implémentation Backend

**productService.js - Nouvelle méthode**:
```javascript
async searchProducts(query, limit = 10) {
  const session = this.driver.session();
  try {
    const result = await session.run(
      `MATCH (p:Product)
       WHERE p.brand CONTAINS $query OR p.id CONTAINS $query
       RETURN p.id as id, p.brand as brand, p.price as price
       LIMIT $limit`,
      { query: query.toUpperCase(), limit: neo4j.int(limit) }
    );
    return result.records.map(record => ({
      id: record.get('id'),
      brand: record.get('brand'),
      price: record.get('price')
    }));
  } finally {
    await session.close();
  }
}
```

**products.js - Nouvelle route**:
```javascript
router.get('/products/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Paramètre q manquant' });
    }
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const results = await productService.searchProducts(q, limit);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Implémentation Frontend

**api.js - Nouvelle méthode**:
```javascript
export const productAPI = {
  // ... existant ...
  search: (query, limit = 10) =>
    fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}`)
      .then(r => r.json())
};
```

**Nouveau composant: SearchBar.js**:
```javascript
import React, { useState } from 'react';
import { productAPI } from '../api';
import './SearchBar.css';

function SearchBar({ onProductSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await productAPI.search(value, 10);
      setResults(response.data || []);
    } catch (error) {
      console.error('Erreur recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Rechercher un produit..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      {loading && <p>Chargement...</p>}
      
      {results.length > 0 && (
        <ul className="search-results">
          {results.map(product => (
            <li key={product.id} onClick={() => onProductSelect(product)}>
              {product.brand} - {product.price}€
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
```

### CSS: SearchBar.css
```css
.search-bar {
  position: relative;
  margin: 20px 0;
}

.search-bar input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 5px;
}

.search-bar input:focus {
  outline: none;
  border-color: #2196F3;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
}

.search-results li {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.search-results li:hover {
  background: #f5f5f5;
}
```

---

## 2.2 FILTRES (PRIX + MARQUE)

### Endpoint
```
GET /api/products?minPrice=100&maxPrice=500&brands=Samsung,LG&limit=20
```

### Implémentation Backend

**productService.js**:
```javascript
async getProductsFiltered(minPrice = 0, maxPrice = 999999, brands = [], limit = 20) {
  const session = this.driver.session();
  try {
    let whereClause = 'WHERE p.price >= $minPrice AND p.price <= $maxPrice';
    const params = { minPrice, maxPrice, limit: neo4j.int(limit) };
    
    if (brands && brands.length > 0) {
      whereClause += ' AND p.brand IN $brands';
      params.brands = brands;
    }
    
    const result = await session.run(
      `MATCH (p:Product) 
       ${whereClause}
       RETURN p.id as id, p.brand as brand, p.price as price
       LIMIT $limit`,
      params
    );
    
    return result.records.map(record => ({
      id: record.get('id'),
      brand: record.get('brand'),
      price: record.get('price')
    }));
  } finally {
    await session.close();
  }
}
```

**products.js**:
```javascript
router.get('/products/filter', async (req, res) => {
  try {
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || 999999;
    const brands = req.query.brands ? req.query.brands.split(',') : [];
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    
    const products = await productService.getProductsFiltered(
      minPrice, maxPrice, brands, limit
    );
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Implémentation Frontend

**Nouveau composant: FilterBar.js**:
```javascript
import React, { useState, useEffect } from 'react';
import { productAPI } from '../api';
import './FilterBar.css';

function FilterBar({ onFilterApply }) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);

  useEffect(() => {
    // Récupérer les brands uniques (à implémenter dans backend)
    // Pour l'MVP, hardcoder les brands connues
    setAvailableBrands(['Samsung', 'Apple', 'Sony', 'LG', 'Dell']);
  }, []);

  const handleApplyFilters = () => {
    onFilterApply({
      minPrice,
      maxPrice,
      brands: selectedBrands
    });
  };

  return (
    <div className="filter-bar">
      <h3>Filtres</h3>
      
      <div className="filter-group">
        <label>Prix: {minPrice}€ - {maxPrice}€</label>
        <input
          type="range"
          min="0"
          max="10000"
          value={minPrice}
          onChange={(e) => setMinPrice(parseInt(e.target.value))}
        />
        <input
          type="range"
          min="0"
          max="10000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(parseInt(e.target.value))}
        />
      </div>
      
      <div className="filter-group">
        <label>Marques</label>
        {availableBrands.map(brand => (
          <label key={brand}>
            <input
              type="checkbox"
              value={brand}
              checked={selectedBrands.includes(brand)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedBrands([...selectedBrands, brand]);
                } else {
                  setSelectedBrands(selectedBrands.filter(b => b !== brand));
                }
              }}
            />
            {brand}
          </label>
        ))}
      </div>
      
      <button onClick={handleApplyFilters}>Appliquer</button>
    </div>
  );
}

export default FilterBar;
```

---

## 2.3 SUGGESTIONS CONTEXTUELLES

### Concept
Quand l'utilisateur consulte une catégorie ou un produit spécifique, afficher les recommandations adaptées.

### Endpoint
```
GET /api/recommendations/category/:name?limit=5
```

### Implémentation Backend (déjà existante, à optimiser)

```javascript
async getPopularProductsByCategoryImproved(categoryName, limit = 5) {
  const session = this.driver.session();
  try {
    const result = await session.run(
      `MATCH (p:Product)-[:BELONGS_TO]->(c:Category {name: $categoryName})
       OPTIONAL MATCH (o:Order)-[:CONTAINS]->(p)
       
       RETURN p.id as id,
              p.brand as brand,
              p.price as price,
              COUNT(o) as purchaseCount,
              'Populaire dans ' + c.name as reason
              
       ORDER BY purchaseCount DESC
       LIMIT $limit`,
      { categoryName, limit: neo4j.int(limit) }
    );
    
    return result.records.map(record => ({
      id: record.get('id'),
      brand: record.get('brand'),
      price: record.get('price'),
      score: record.get('purchaseCount').toNumber(),
      reason: record.get('reason')
    }));
  } finally {
    await session.close();
  }
}
```

---

## 2.4 SCORING AMÉLIORÉ

### Concept Actuel (PHASE 1)
```
Score = COUNT(DISTINCT commandes)
```

### Nouveau Scoring (PHASE 2)

```cypher
// Plus sophistiqué: 
// Score = fréquence + récence + prix

WITH p2, coFrequency,
     // Bonus si acheté récemment (moins de 30 jours) - optionnel
     CASE WHEN o.date > datetime().epochSeconds - (30 * 86400) 
          THEN coFrequency * 1.2 ELSE coFrequency END as weightedScore,
     // Bonus si prix proche du panier
     CASE WHEN ABS(p2.price - avgBasketPrice) < 100
          THEN weightedScore * 1.1 ELSE weightedScore END as finalScore
          
RETURN p2, finalScore as score
ORDER BY finalScore DESC
```

### Implémentation Progressive

**MVP (PHASE 1)**: `Score = fréquence`
**Phase 2.1**: `Score = fréquence + popularité globale`
**Phase 2.2**: `Score = fréquence * (1 + bonusRécence + bonusPrix)`

---

## 2.5 EXPORT RECOMMANDATIONS

### Endpoint
```
POST /api/orders/create
Body: {
  productIds: ["prod1", "prod2"],
  customerEmail: "user@example.com"
}
Response: {
  orderId: "order_123",
  products: [...],
  recommendations: [...]
}
```

### Use Case
Permettre à l'utilisateur de :
1. Créer une commande
2. Recevoir les recommandations
3. Ajouter recommandations à la commande si souhaité

---

## 📊 PRIORITÉS PHASE 2

| Feature | Impact | Effort | Priorité |
|---------|--------|--------|----------|
| Recherche | ⭐⭐⭐ | 🔨 2h | 1️⃣ |
| Filtres | ⭐⭐ | 🔨 3h | 2️⃣ |
| Suggestions contextuelles | ⭐⭐ | 🔨 1h | 3️⃣ |
| Scoring amélioré | ⭐⭐⭐ | 🔨 2h | 4️⃣ |
| Export/Commandes | ⭐ | 🔨 2h | 5️⃣ |

---

## 🚀 GETTING STARTED

### Étape 1: Cloner la branche PHASE 2
```bash
# (quand vous êtes prêt)
git checkout -b feature/phase-2-search
```

### Étape 2: Implémenter dans l'ordre
1. **Recherche** (plus impactant et facile)
2. **Filtres** (naturel après recherche)
3. **Suggestions** (réutilise les queries existantes)

### Étape 3: Tester chaque feature
```bash
# Lancer les tests
npm test

# Ou manuellement
curl http://localhost:5000/api/products/search?q=samsung
```

---

## 📝 Notes Techniques

### Index à Créer pour PHASE 2
```cypher
// Améliorer les perfs de recherche
CREATE INDEX product_brand IF NOT EXISTS
FOR (p:Product) ON (p.brand);

// Filtres de prix
CREATE INDEX product_price IF NOT EXISTS
FOR (p:Product) ON (p.price);

// Catégories
CREATE INDEX category_name IF NOT EXISTS
FOR (c:Category) ON (c.name);
```

### Cache Recommendations
```javascript
// Optionnel: cacher les recommandations pour les panier classiques
const cache = new Map();

const getCachedRecommendations = (basketId) => {
  if (cache.has(basketId)) {
    return cache.get(basketId);
  }
  return null;
};
```

---

## ✅ CHECKLIST AVANT PHASE 2

- [ ] PHASE 1 démontrée au jury ✓
- [ ] Feedback collecté ✓
- [ ] Données suffisantes dans Neo4j ✓
- [ ] Tous les tests PHASE 1 passent ✓
- [ ] Branche feature/phase-2 créée ✓

---

**Version**: PHASE 2 Roadmap
**Statut**: À planifier après PHASE 1 validation
**Effort Estimé**: 10-15 heures

