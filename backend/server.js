const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Services
const ProductService = require('./services/productService');
const RecommendationService = require('./services/recommendationService');
const OrderService = require('./services/orderService');
const AuthService = require('./services/authService');

// Config
const driver = require('./config/neo4j');
const config = require('./config/config');

// Initialiser les services
const productService = new ProductService(driver);
const recommendationService = new RecommendationService(driver);
const orderService = new OrderService(driver);
const authService = new AuthService(driver);

// Créer l'application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ CRÉER LES DOSSIERS S'ILS N'EXISTENT PAS
const uploadsDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(__dirname, 'public/images');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("[Server] ✅ Dossier uploads créé");
}

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log("[Server] ✅ Dossier public/images créé");
}

// ✅ SERVIR LES FICHIERS STATIQUES (AVANT LES ROUTES)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

console.log("[Server] ✅ Middleware statique configuré:");
console.log("[Server]    /uploads -> ", path.join(__dirname, 'uploads'));
console.log("[Server]    /images  -> ", path.join(__dirname, 'public/images'));

// Middleware JWT pour protéger les routes
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const decoded = authService.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }

  req.user = decoded;
  next();
};

// Middleware pour vérifier le rôle ADMIN
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

// Routes publiques (sans authentification)
app.use('/api/auth', require('./routes/auth')(authService));

// Routes protégées (avec authentification)
app.use('/api', verifyToken, require('./routes/products')(productService));
app.use('/api', verifyToken, require('./routes/orders')(orderService));
app.use('/api', verifyToken, require('./routes/recommendations')(recommendationService));

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'SmartShop API is running' });
});

// ✅ ROUTE DE TEST POUR VÉRIFIER LES FICHIERS
app.get('/api/test/uploads', (req, res) => {
  const uploadsPath = path.join(__dirname, 'uploads/products');
  try {
    const files = fs.readdirSync(uploadsPath);
    console.log("[Test] Fichiers dans /uploads/products:", files);
    return res.json({
      success: true,
      path: uploadsPath,
      files: files,
      count: files.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      path: uploadsPath
    });
  }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Server error' });
});

// Démarrer le serveur
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`[Server] 🚀 Backend démarré sur http://localhost:${PORT}`);
  console.log(`[Server] ✅ Prêt à recevoir les uploads`);
  console.log(`Neo4j connected to ${config.neo4j.uri}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await driver.close();
  process.exit(0);
});

module.exports = app;
