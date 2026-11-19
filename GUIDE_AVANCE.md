# Guide Avancé SmartShop

## 🎓 Concepts du Moteur de Recommandation

### 1. Recommandations par Co-achats
Les produits fréquemment achetés ensemble sont recommandés.

**Requête Cypher:**
```cypher
MATCH (p1:Product {id: $productId})<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(p2:Product)
WHERE p2 <> p1
RETURN p2, COUNT(DISTINCT o) as frequency
ORDER BY frequency DESC
```

**Cas d'usage:** Afficher "Souvent acheté avec ce produit"

### 2. Recommandations par Catégorie
Les produits de catégories similaires à ceux du panier.

**Requête Cypher:**
```cypher
MATCH (p1:Product)-[:BELONGS_TO]->(c:Category)<-[:BELONGS_TO]-(p2:Product)
WHERE p1.id IN $basketIds AND p2.id NOT IN $basketIds
RETURN p2, COUNT(DISTINCT c) as categoryMatches
ORDER BY categoryMatches DESC
```

**Cas d'usage:** Panier intelligent qui propose des produits complémentaires

### 3. Recommandations Basées sur l'Historique
Produits populaires pour ceux qui ont acheté les mêmes articles.

**Requête Cypher:**
```cypher
MATCH (o1:Order {id: $orderId})-[:CONTAINS]->(p1:Product)
MATCH (p1)-[:BELONGS_TO]->(c:Category)<-[:BELONGS_TO]-(p2:Product)
MATCH (o2:Order)-[:CONTAINS]->(p2)
WHERE o2 <> o1 AND p2 <> p1
RETURN p2, COUNT(DISTINCT o2) as relevance
ORDER BY relevance DESC
```

**Cas d'usage:** "Basé sur votre commande précédente"

## 🔄 Extension du Système

### Ajouter une Nouvelle Relation

**Exemple: Ajouter des évaluations**

```javascript
// Backend - Créer une nouvelle entité Review
MATCH (u:User {id: $userId}), (p:Product {id: $productId})
CREATE (u)-[:REVIEWED {rating: $rating, text: $text}]->(p)
```

```javascript
// Service de recommandation
async getTopRatedProducts(limit = 5) {
  const result = await session.run(
    `MATCH (p:Product)<-[r:REVIEWED]-()
     RETURN p, AVG(r.rating) as avgRating
     ORDER BY avgRating DESC
     LIMIT $limit`,
    { limit }
  );
}
```

### Ajouter des Filtres de Prix

```javascript
async getProductsByPriceRange(minPrice, maxPrice) {
  const result = await session.run(
    `MATCH (p:Product)
     WHERE p.price >= $minPrice AND p.price <= $maxPrice
     RETURN p
     ORDER BY p.price`,
    { minPrice, maxPrice }
  );
}
```

## 📊 Optimisation des Performances

### Index Neo4j

```cypher
// Créer des index pour accélérer les requêtes
CREATE INDEX FOR (p:Product) ON (p.id);
CREATE INDEX FOR (o:Order) ON (o.id);
CREATE INDEX FOR (c:Category) ON (c.name);
```

### Analyse de Performance

```cypher
// Voir les performances d'une requête
PROFILE
MATCH (p:Product {id: "P1"})<-[:CONTAINS]-(o:Order)
RETURN p, COUNT(o) as orders
```

## 🔐 Sécurité et Validation

### Validation des Entrées (Backend)

```javascript
// services/productService.js
async getProductById(productId) {
  // Valider le format
  if (!productId || typeof productId !== 'string') {
    throw new Error('ID de produit invalide');
  }
  
  // Sanitizer pour éviter les injections
  const sanitized = productId.replace(/[^a-zA-Z0-9_-]/g, '');
  
  // Requête sécurisée avec paramètres
  const result = await session.run(
    'MATCH (p:Product {id: $id}) RETURN p',
    { id: sanitized }
  );
}
```

### Gestion d'Erreurs

```javascript
// Toujours utiliser des paramètres, jamais de concaténation
// ❌ MAUVAIS
const query = `MATCH (p:Product {id: "${productId}"}) RETURN p`;

// ✅ BON
const query = 'MATCH (p:Product {id: $id}) RETURN p';
const result = await session.run(query, { id: productId });
```

## 📈 Métriques et Monitoring

### Requête pour l'Analytics

```javascript
// Produits les plus consultés
async getMostViewedProducts(limit = 10) {
  const result = await session.run(
    `MATCH (p:Product)<-[:CONTAINS]-(o:Order)
     RETURN p, COUNT(o) as views
     ORDER BY views DESC
     LIMIT $limit`,
    { limit }
  );
}

// Catégories les plus populaires
async getPopularCategories(limit = 5) {
  const result = await session.run(
    `MATCH (c:Category)<-[:BELONGS_TO]-(p:Product)<-[:CONTAINS]-(o:Order)
     RETURN c, COUNT(DISTINCT o) as sales
     ORDER BY sales DESC
     LIMIT $limit`,
    { limit }
  );
}
```

## 🚀 Déploiement en Production

### Variables d'Environnement Sécurisées

```bash
# .env.production
NEO4J_URI=bolt+s://neo4j-prod.example.com:7687
NEO4J_USER=neo4j_prod
NEO4J_PASSWORD=${SECURE_PASSWORD}
PORT=5000
NODE_ENV=production
LOG_LEVEL=info
```

### Configuration Docker Avancée

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  neo4j:
    image: neo4j:5-enterprise
    environment:
      NEO4J_AUTH: neo4j/${NEO4J_PASSWORD}
      NEO4J_PLUGINS: '["graph-data-science"]'
    volumes:
      - neo4j_prod_data:/var/lib/neo4j/data
      - neo4j_backups:/var/lib/neo4j/backups

  backend:
    image: smartshop-backend:latest
    environment:
      NODE_ENV: production
      NEO4J_URI: ${NEO4J_URI}
    restart: always
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
```

## 🔄 Stratégies de Cache

### Cache Redis (Option)

```javascript
// backend/services/cacheService.js
const redis = require('redis');
const client = redis.createClient();

class CacheService {
  async getOrSet(key, fetcher, ttl = 3600) {
    const cached = await client.get(key);
    if (cached) return JSON.parse(cached);
    
    const data = await fetcher();
    await client.setex(key, ttl, JSON.stringify(data));
    return data;
  }
}
```

## 📱 Intégration Frontend Avancée

### Infinite Scroll pour les Recommandations

```javascript
// frontend/src/hooks/useInfiniteRecommendations.js
import { useEffect, useState } from 'react';
import { recommendationAPI } from '../api';

export const useInfiniteRecommendations = (productId) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    const limit = 5;
    const offset = (page - 1) * limit;
    const data = await recommendationAPI.getCoBought(
      productId, 
      limit
    );
    
    if (data.length < limit) setHasMore(false);
    setItems([...items, ...data]);
    setPage(page + 1);
  };

  return { items, loadMore, hasMore };
};
```

## 🧪 Tests Avancés

### Test Intégration Backend

```javascript
// backend/__tests__/recommendations.test.js
const RecommendationService = require('../services/recommendationService');
const neo4j = require('neo4j-driver');

describe('RecommendationService', () => {
  let service;
  let driver;

  beforeAll(async () => {
    driver = neo4j.driver('bolt://localhost:7687');
    service = new RecommendationService(driver);
  });

  test('Should get co-bought products', async () => {
    const recommendations = await service.getCoBoughtProducts('P1', 5);
    expect(recommendations).toBeInstanceOf(Array);
  });

  afterAll(async () => {
    await driver.close();
  });
});
```

## 🔗 Ressources Utiles

- [Documentation Neo4j Cypher](https://neo4j.com/docs/cypher-manual/)
- [Neo4j Driver Node.js](https://neo4j.com/docs/driver-manual/current/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)

## 💡 Astuces et Bonnes Pratiques

1. **Toujours fermer les sessions Neo4j** pour éviter les fuites de connexion
2. **Utiliser des transactions** pour les opérations complexes
3. **Paginer les résultats** pour les grandes bases de données
4. **Ajouter des logs détaillés** pour le debugging
5. **Monitorer les performances** des requêtes Cypher
6. **Tester les cas limites** (produits sans catégorie, etc.)
7. **Utiliser des identifiants uniques** pour les nœuds

---

Pour plus d'informations, consultez la documentation principale du projet.
