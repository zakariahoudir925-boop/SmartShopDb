const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// ✅ CRÉER LE DOSSIER D'UPLOAD S'IL N'EXISTE PAS
const uploadDir = path.join(__dirname, '../uploads/products');
console.log("[Routes] Upload directory:", uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("[Routes] ✅ Dossier d'upload créé:", uploadDir);
} else {
  console.log("[Routes] ✅ Dossier d'upload existe déjà");
}

// ✅ CONFIGURATION MULTER AVEC LOGS DÉTAILLÉS
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("[Multer] 📁 Destination:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.random().toString(36).substr(2, 9) + path.extname(file.originalname);
    console.log("[Multer] 💾 Nom du fichier:", uniqueName);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    console.log("[Multer] 🔍 Fichier reçu:", file.originalname);
    console.log("[Multer] 🔍 MIME type:", file.mimetype);
    
    const allowedTypes = /jpeg|jpg|png|webp/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    console.log("[Multer] ✓ MIME valide:", mimetype);
    console.log("[Multer] ✓ Extension valide:", extname);
    
    if (mimetype && extname) {
      console.log("[Multer] ✅ Fichier ACCEPTÉ");
      return cb(null, true);
    }
    
    console.log("[Multer] ❌ Fichier REJETÉ");
    cb(new Error('Only image files (JPEG, PNG, WebP) are allowed'));
  }
});

module.exports = (productService) => {
  // Middleware pour vérifier admin
  const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
  };

  // GET /api/products - Visible à tous (admin + client) - Retourne TOUS les produits
  router.get('/products', async (req, res) => {
    try {
      console.log(`[API] GET /api/products`);
      
      // Ne PAS utiliser de limite par défaut - retourner TOUS les produits
      const limit = req.query.limit ? parseInt(req.query.limit) : null;
      
      console.log(`[API] Limit demandé: ${limit || 'NONE (ALL)'}`);
      
      const products = await productService.getAllProducts(limit);
      
      console.log(`[API] ✅ Retour ${products.length} produits`);
      
      return res.status(200).json(products);
      
    } catch (error) {
      console.error(`[API] ❌ Erreur GET /api/products:`, error.message);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch products',
        message: error.message
      });
    }
  });

  // GET /api/products/count - Diagnostic endpoint
  router.get('/products/count', async (req, res) => {
    try {
      console.log(`[API] GET /api/products/count`);
      const session = productService.driver.session();
      const result = await session.run('MATCH (p:Product) RETURN count(p) as total');
      await session.close();
      
      const total = result.records[0].get('total').toNumber();
      console.log(`[API] Total products in Neo4j: ${total}`);
      res.json({ success: true, total });
    } catch (error) {
      console.error(`[API] ERROR /api/products/count:`, error.message);
      res.status(500).json({ success: false, error: 'Failed to count products' });
    }
  });

  // GET /api/products/search - Recherche produits
  router.get('/products/search', async (req, res) => {
    try {
      const { query } = req.query;
      if (!query) {
        return res.status(400).json({ success: false, error: 'Search query required' });
      }

      const session = productService.driver.session();
      const result = await session.run(
        `MATCH (p:Product) 
         WHERE p.brand CONTAINS $query OR p.id CONTAINS $query
         RETURN p.id as id, p.brand as brand, p.price as price
         LIMIT 20`,
        { query }
      );
      await session.close();

      const products = result.records.map(record => ({
        id: record.get('id'),
        brand: record.get('brand'),
        price: record.get('price'),
        name: record.get('brand')
      }));

      res.json({ success: true, count: products.length, data: products });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Search failed' });
    }
  });

  // GET /api/products/:id - Récupérer un produit
  router.get('/products/:id', async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
  });

  // POST /api/products - Créer produit (ADMIN ONLY) avec upload image
  router.post('/products', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
      console.log(`\n========== POST /api/products WITH IMAGE ==========`);
      console.log(`[API] POST /api/products reçue`);
      console.log(`[API] User: ${req.user.email} (Role: ${req.user.role})`);
      console.log(`[API] Body reçu:`, req.body);
      console.log(`[API] File info:`, req.file ? `${req.file.filename} (${req.file.size} bytes)` : 'No file');
      
      const { id, brand, price, category } = req.body;
      
      // Validation
      if (!id || !brand || !price || !category) {
        if (req.file) {
          fs.unlinkSync(path.join(uploadDir, req.file.filename));
        }
        console.warn(`[API] ⚠️ Champs obligatoires manquants`);
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: id, brand, price, category'
        });
      }

      // Construire l'URL de l'image
      const imageUrl = req.file 
        ? `/uploads/products/${req.file.filename}`
        : '/images/placeholder.png';

      console.log(`[API] 🖼️ Image URL: ${imageUrl}`);
      console.log(`[API] Appel ProductService.createProduct()`);
      
      const product = await productService.createProduct(
        id, 
        brand, 
        parseFloat(price), 
        category, 
        imageUrl
      );
      
      // ✅ VÉRIFIER QUE LE FICHIER EXISTE
      if (req.file) {
        const filePath = path.join(uploadDir, req.file.filename);
        const fileExists = fs.existsSync(filePath);
        console.log("[API] 📂 Fichier physique existe?", fileExists ? "✅ OUI" : "❌ NON");
        if (fileExists) {
          console.log("[API] 📂 Taille du fichier:", fs.statSync(filePath).size, "bytes");
        }
      }
      
      console.log(`[API] ✅ Produit créé avec succès`);
      console.log(`[API] ========== POST /api/products COMPLETED (SUCCESS) ==========\n`);
      
      return res.status(201).json({
        success: true,
        message: 'Product created successfully with image',
        data: product
      });
      
    } catch (error) {
      // Supprimer le fichier en cas d'erreur
      if (req.file) {
        const filePath = path.join(uploadDir, req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      console.error(`\n[API] ❌ ERREUR dans POST /api/products:`);
      console.error(`[API] Message: ${error.message}`);
      console.error(`[API] ========== POST /api/products COMPLETED (ERROR) ==========\n`);
      
      return res.status(500).json({ 
        success: false, 
        message: 'Error creating product',
        error: error.message 
      });
    }
  });

  // GET /api/products/:id/categories
  router.get('/products/:id/categories', async (req, res) => {
    try {
      const categories = await productService.getProductCategories(req.params.id);
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
  });

  // GET /api/categories/:name/products
  router.get('/categories/:name/products', async (req, res) => {
    try {
      const products = await productService.getProductsByCategory(req.params.name);
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
  });

  // DELETE /api/products/:id - Supprimer un produit (ADMIN ONLY)
  router.delete('/products/:id', verifyAdmin, async (req, res) => {
    try {
      console.log(`[API] DELETE /api/products/${req.params.id}`);
      console.log(`[API] User: ${req.user.email} (Role: ${req.user.role})`);

      const session = productService.driver.session();
      
      // Vérifier que le produit existe
      const checkResult = await session.run('MATCH (p:Product) WHERE p.id = $id RETURN p', {
        id: req.params.id
      });

      if (checkResult.records.length === 0) {
        await session.close();
        console.warn(`[API] ⚠️ Produit non trouvé: ${req.params.id}`);
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      // Supprimer le produit
      await session.run('MATCH (p:Product) WHERE p.id = $id DETACH DELETE p', {
        id: req.params.id
      });

      await session.close();

      console.log(`[API] ✅ Produit supprimé avec succès: ${req.params.id}`);
      return res.status(200).json({ 
        success: true, 
        message: 'Product deleted successfully'
      });

    } catch (error) {
      console.error(`[API] ❌ Erreur DELETE /api/products:`, error.message);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to delete product',
        message: error.message
      });
    }
  });

  // ✅ PUT /api/products/:id - Mettre à jour un produit (ADMIN ONLY)
  router.put('/products/:id', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
      console.log(`\n========== PUT /api/products/${req.params.id} ==========`);
      console.log(`[API] User: ${req.user.email} (Role: ${req.user.role})`);
      console.log(`[API] Body reçu:`, req.body);
      console.log(`[API] File reçu?`, req.file ? `✅ OUI (${req.file.filename})` : `❌ NON`);

      const { id, brand, price, category } = req.body;
      const productId = req.params.id;

      // ✅ VALIDATION
      if (!brand || !price || !category) {
        if (req.file) {
          fs.unlinkSync(path.join(uploadDir, req.file.filename));
        }
        console.error(`[API] ❌ Champs manquants`);
        return res.status(400).json({
          success: false,
          message: "Tous les champs sont requis (brand, price, category)"
        });
      }

      if (parseFloat(price) <= 0) {
        if (req.file) {
          fs.unlinkSync(path.join(uploadDir, req.file.filename));
        }
        return res.status(400).json({
          success: false,
          message: "Le prix doit être positif"
        });
      }

      // ✅ CONSTRUIRE L'URL DE L'IMAGE (si nouvelle image)
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/products/${req.file.filename}`;
        console.log(`[API] 🖼️ Nouvelle image:`, imageUrl);
      }

      // ✅ METTRE À JOUR LE PRODUIT
      const result = await productService.updateProduct(
        productId,
        brand.trim(),
        parseFloat(price),
        category.trim(),
        imageUrl
      );

      console.log(`[API] ✅ Produit mis à jour`);
      console.log(`[API] ========== PUT /api/products/${req.params.id} COMPLETED (SUCCESS) ==========\n`);

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.product
      });

    } catch (error) {
      if (req.file) {
        const filePath = path.join(uploadDir, req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      console.error(`[API] ❌ Erreur PUT /api/products:`, error.message);
      console.error(`[API] ========== PUT /api/products/${req.params.id} COMPLETED (ERROR) ==========\n`);
      
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour",
        error: error.message
      });
    }
  });

  return router;
};
