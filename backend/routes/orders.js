const express = require('express');
const router = express.Router();

module.exports = (orderService) => {
  // Récupérer une commande
  router.get('/orders/:id', async (req, res) => {
    try {
      const order = await orderService.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ success: false, error: 'Commande non trouvée' });
      }
      res.json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Récupérer les produits d'une commande
  router.get('/orders/:id/products', async (req, res) => {
    try {
      const products = await orderService.getOrderProducts(req.params.id);
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Créer une commande
  router.post('/orders', async (req, res) => {
    try {
      const { id, productIds } = req.body;
      if (!id || !productIds || !Array.isArray(productIds)) {
        return res.status(400).json({ success: false, error: 'Paramètres invalides' });
      }
      const order = await orderService.createOrder(id, productIds);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};
