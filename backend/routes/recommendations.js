const express = require('express');
const router = express.Router();

module.exports = (recommendationService) => {
  // Recommandations basées sur une commande
  router.get('/recommendations/order/:orderId', async (req, res) => {
    try {
      const limit = req.query.limit || 5;
      const recommendations = await recommendationService.getRecommendationsByOrder(
        req.params.orderId, 
        limit
      );
      res.json({ success: true, data: recommendations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Produits populaires dans une catégorie
  router.get('/recommendations/category/:name', async (req, res) => {
    try {
      const limit = req.query.limit || 5;
      const recommendations = await recommendationService.getPopularProductsByCategory(
        req.params.name, 
        limit
      );
      res.json({ success: true, data: recommendations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Recommandations basées sur le panier (OLD - basées sur les catégories)
  router.post('/recommendations/basket', async (req, res) => {
    try {
      const { productIds } = req.body;
      if (!productIds || !Array.isArray(productIds)) {
        return res.status(400).json({ success: false, error: 'productIds doit être un tableau' });
      }
      const limit = req.query.limit || 5;
      const recommendations = await recommendationService.getBasketRecommendations(
        productIds, 
        limit
      );
      res.json({ success: true, data: recommendations });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 🆕 Recommandations avancées basées sur CO_PURCHASED (PHASE 1)
  // Endpoint principal pour le panier - utilise les co-achats réels
  router.post('/recommendations/basket/advanced', async (req, res) => {
    try {
      const { basketIds } = req.body;
      if (!basketIds || !Array.isArray(basketIds)) {
        return res.status(400).json({ success: false, error: 'basketIds doit être un tableau' });
      }
      const limit = Math.min(parseInt(req.query.limit) || 5, 20); // Max 20
      
      console.log(`🧠 Recommandations avancées pour panier: ${basketIds.join(', ')} (limit: ${limit})`);
      const recommendations = await recommendationService.getAdvancedBasketRecommendations(
        basketIds,
        limit
      );
      console.log(`✅ ${recommendations.length} recommandations trouvées`);
      
      res.json({ success: true, data: recommendations });
    } catch (error) {
      console.error('❌ Erreur recommandations avancées:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Produits co-achetés
  router.get('/recommendations/cobought/:productId', async (req, res) => {
    try {
      const limit = req.query.limit || 5;
      console.log(`🔍 Recherche de produits co-achetés pour ${req.params.productId} (limit: ${limit})...`);
      const recommendations = await recommendationService.getCoBoughtProducts(
        req.params.productId, 
        limit
      );
      console.log(`✅ ${recommendations.length} produits co-achetés trouvés`);
      res.json({ success: true, data: recommendations });
    } catch (error) {
      console.error('❌ Erreur co-achetés:', error.message, error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 🆕 Recommandations par produit spécifique (pour la section "Vous aimerez aussi")
  router.get('/recommendations/product/:productId', async (req, res) => {
    try {
      const limit = req.query.limit || 4;
      console.log(`🎁 Recommandations pour produit ${req.params.productId} (limit: ${limit})`);
      const recommendations = await recommendationService.getCoBoughtProducts(
        req.params.productId, 
        limit
      );
      
      // 🆕 Fallback: si aucune recommandation, charger des produits aléatoires
      if (recommendations.length === 0) {
        console.log(`⚠️ Aucune recommandation trouvée, fallback vers produits aléatoires`);
        const randomProducts = await recommendationService.getRandomProducts(
          limit,
          [req.params.productId]
        );
        console.log(`✅ ${randomProducts.length} produits aléatoires chargés`);
        return res.json({ success: true, data: randomProducts });
      }
      
      console.log(`✅ ${recommendations.length} recommandations trouvées`);
      res.json({ success: true, data: recommendations });
    } catch (error) {
      console.error('❌ Erreur recommandations produit:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};
