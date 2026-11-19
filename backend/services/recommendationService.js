const neo4j = require('neo4j-driver');

class RecommendationService {
  constructor(driver) {
    this.driver = driver;
  }

  // Recommander des produits basés sur les achats similaires
  async getRecommendationsByOrder(orderId, limit = 5) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (o1:Order {id: $orderId})-[:CONTAINS]->(p1:Product)
         MATCH (p1)-[:BELONGS_TO]->(c:Category)<-[:BELONGS_TO]-(p2:Product)
         MATCH (o2:Order)-[:CONTAINS]->(p2)
         WHERE o2 <> o1 AND p2 <> p1
         RETURN DISTINCT p2.id as id, p2.brand as brand, p2.price as price, 
                COUNT(DISTINCT o2) as relevance
         ORDER BY relevance DESC
         LIMIT $limit`,
        { orderId, limit: neo4j.int(limit) }
      );
      return result.records.map(record => ({
        id: record.get('id'),
        brand: record.get('brand'),
        price: record.get('price'),
        relevance: record.get('relevance')
      }));
    } finally {
      await session.close();
    }
  }

  // Recommander les produits populaires dans une catégorie
  async getPopularProductsByCategory(categoryName, limit = 5) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (p:Product)-[:BELONGS_TO]->(c:Category {name: $categoryName})
         OPTIONAL MATCH (o:Order)-[:CONTAINS]->(p)
         RETURN p.id as id, p.brand as brand, p.price as price, 
                COUNT(o) as purchaseCount
         ORDER BY purchaseCount DESC
         LIMIT $limit`,
        { categoryName, limit: neo4j.int(limit) }
      );
      return result.records.map(record => ({
        id: record.get('id'),
        brand: record.get('brand'),
        price: record.get('price'),
        purchaseCount: record.get('purchaseCount')
      }));
    } finally {
      await session.close();
    }
  }

  // Recommandations basées sur le panier de l'utilisateur
  async getBasketRecommendations(productIds, limit = 5) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (p1:Product)-[:BELONGS_TO]->(c:Category)<-[:BELONGS_TO]-(p2:Product)
         WHERE p1.id IN $productIds AND p2.id NOT IN $productIds
         RETURN DISTINCT p2.id as id, p2.brand as brand, p2.price as price, 
                COUNT(DISTINCT c) as categoryMatches
         ORDER BY categoryMatches DESC
         LIMIT $limit`,
        { productIds, limit: neo4j.int(limit) }
      );
      return result.records.map(record => ({
        id: record.get('id'),
        brand: record.get('brand'),
        price: record.get('price'),
        categoryMatches: record.get('categoryMatches')
      }));
    } finally {
      await session.close();
    }
  }

  // Produits co-achetés
  async getCoBoughtProducts(productId, limit = 5) {
    const session = this.driver.session();
    try {
      // Transformer l'ID en string pour robustesse
      const idAsString = String(productId);
      
      const result = await session.run(
        `MATCH (p1:Product {id: toString($productId)})<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(p2:Product)
         WHERE p2 <> p1
         RETURN DISTINCT p2.id as id, p2.brand as brand, p2.price as price, 
                COUNT(DISTINCT o) as frequency
         ORDER BY frequency DESC
         LIMIT $limit`,
        { productId: idAsString, limit: neo4j.int(limit) }
      );
      return result.records.map(record => ({
        id: record.get('id'),
        brand: record.get('brand'),
        price: record.get('price'),
        frequency: record.get('frequency')
      }));
    } finally {
      await session.close();
    }
  }

  // 🆕 Recommandations avancées basées sur les co-achats (PHASE 1)
  // Algorithme : pour chaque produit du panier, trouver ses co-achats directs
  // Score = nombre de commandes où les deux produits ont été achetés ensemble
  async getAdvancedBasketRecommendations(basketIds, limit = 5) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `// Trouver les co-achats pour tous les produits du panier
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
         LIMIT $limit`,
        { basketIds, limit: neo4j.int(limit) }
      );

      return result.records.map(record => ({
        id: record.get('id'),
        brand: record.get('brand'),
        price: record.get('price'),
        score: record.get('score').toNumber(),
        popularity: record.get('popularity').toNumber(),
        reason: record.get('reason')
      }));
    } finally {
      await session.close();
    }
  }

  // 🆕 Fallback: Produits aléatoires pour recommandations
  // Utilisé quand aucune relation de co-achat n'existe
  async getRandomProducts(limit = 4, excludeIds = []) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (p:Product)
         WHERE NOT p.id IN $excludeIds
         RETURN p.id as id, p.brand as brand, p.price as price
         ORDER BY rand()
         LIMIT $limit`,
        { excludeIds: excludeIds || [], limit: neo4j.int(limit) }
      );
      return result.records.map(record => ({
        id: record.get('id'),
        brand: record.get('brand'),
        price: record.get('price'),
        isRandom: true // Flag pour savoir que c'est du fallback
      }));
    } finally {
      await session.close();
    }
  }
}

module.exports = RecommendationService;
