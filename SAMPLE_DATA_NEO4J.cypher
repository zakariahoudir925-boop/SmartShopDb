// 🗄️ REQUÊTES NEO4J - DONNÉES DE TEST PHASE 1
// Exécutez ces requêtes dans Neo4j Browser pour tester PHASE 1

// ==================================================
// ⚠️ NETTOYAGE (À NE FAIRE QU'UNE FOIS)
// ==================================================

// Supprimer toutes les relations et nœuds
MATCH (n) DETACH DELETE n;

// ==================================================
// 1️⃣ CRÉER LES PRODUITS
// ==================================================

CREATE (p1:Product {id: "prod_laptop", brand: "Dell XPS", price: 1200})
CREATE (p2:Product {id: "prod_screen", brand: "LG UltraWide", price: 399})
CREATE (p3:Product {id: "prod_keyboard", brand: "Logitech MX", price: 99})
CREATE (p4:Product {id: "prod_mouse", brand: "Razer DeathAdder", price: 79})
CREATE (p5:Product {id: "prod_mousepad", brand: "SteelSeries", price: 49})
CREATE (p6:Product {id: "prod_case", brand: "Thule", price: 89})
CREATE (p7:Product {id: "prod_cable_usb", brand: "Belkin USB-C", price: 19})
CREATE (p8:Product {id: "prod_hub", brand: "Anker USB Hub", price: 29})
CREATE (p9:Product {id: "prod_monitor", brand: "Dell S2722DC", price: 549})
CREATE (p10:Product {id: "prod_dock", brand: "CalDigit Dock", price: 349});

// ==================================================
// 2️⃣ CRÉER LES CATÉGORIES
// ==================================================

CREATE (c1:Category {name: "Ordinateurs"})
CREATE (c2:Category {name: "Moniteurs"})
CREATE (c3:Category {name: "Périphériques"})
CREATE (c4:Category {name: "Accessoires"});

// ==================================================
// 3️⃣ ASSIGNER LES PRODUITS AUX CATÉGORIES
// ==================================================

MATCH (p:Product {id: "prod_laptop"}), (c:Category {name: "Ordinateurs"})
CREATE (p)-[:BELONGS_TO]->(c);

MATCH (p:Product {id: "prod_screen"}), (c:Category {name: "Moniteurs"})
CREATE (p)-[:BELONGS_TO]->(c);

MATCH (p:Product {id: "prod_monitor"}), (c:Category {name: "Moniteurs"})
CREATE (p)-[:BELONGS_TO]->(c);

MATCH (p:Product {id: "prod_dock"}), (c:Category {name: "Ordinateurs"})
CREATE (p)-[:BELONGS_TO]->(c);

MATCH (p:Product WHERE p.id IN ["prod_keyboard", "prod_mouse", "prod_mousepad"])
MATCH (c:Category {name: "Périphériques"})
CREATE (p)-[:BELONGS_TO]->(c);

MATCH (p:Product WHERE p.id IN ["prod_case", "prod_cable_usb", "prod_hub"])
MATCH (c:Category {name: "Accessoires"})
CREATE (p)-[:BELONGS_TO]->(c);

// ==================================================
// 4️⃣ CRÉER LES COMMANDES (Orders)
// ==================================================

// Commande 1: Laptop + Screen + Keyboard (très classique)
CREATE (o1:Order {id: "order_001", date: "2024-01-01"});
// Commande 2: Laptop + Screen + Keyboard
CREATE (o2:Order {id: "order_002", date: "2024-01-02"});
// Commande 3: Laptop + Screen + Mouse
CREATE (o3:Order {id: "order_003", date: "2024-01-03"});
// Commande 4: Screen + Keyboard
CREATE (o4:Order {id: "order_004", date: "2024-01-04"});
// Commande 5: Laptop + Dock + Monitor
CREATE (o5:Order {id: "order_005", date: "2024-01-05"});

// Commande 6: Laptop + Screen + Keyboard + Mouse (panier complet)
CREATE (o6:Order {id: "order_006", date: "2024-01-06"});
// Commande 7: Laptop + Screen + Mousepad
CREATE (o7:Order {id: "order_007", date: "2024-01-07"});
// Commande 8: Mouse + Mousepad + Cable
CREATE (o8:Order {id: "order_008", date: "2024-01-08"});
// Commande 9: Keyboard + Mouse (combo populaire)
CREATE (o9:Order {id: "order_009", date: "2024-01-09"});
// Commande 10: Keyboard + Mouse
CREATE (o10:Order {id: "order_010", date: "2024-01-10"});

// Plus de commandes pour augmenter le signal
CREATE (o11:Order {id: "order_011", date: "2024-01-11"});
CREATE (o12:Order {id: "order_012", date: "2024-01-12"});
CREATE (o13:Order {id: "order_013", date: "2024-01-13"});
CREATE (o14:Order {id: "order_014", date: "2024-01-14"});
CREATE (o15:Order {id: "order_015", date: "2024-01-15"});

// ==================================================
// 5️⃣ CRÉER LES RELATIONS CONTAINS (produits dans commandes)
// ==================================================

// Commande 1: Laptop, Screen, Keyboard
MATCH (o:Order {id: "order_001"}), (p:Product {id: "prod_laptop"})
CREATE (o)-[:CONTAINS]->(p);
MATCH (o:Order {id: "order_001"}), (p:Product {id: "prod_screen"})
CREATE (o)-[:CONTAINS]->(p);
MATCH (o:Order {id: "order_001"}), (p:Product {id: "prod_keyboard"})
CREATE (o)-[:CONTAINS]->(p);

// Commande 2: Laptop, Screen, Keyboard
MATCH (o:Order {id: "order_002"}), (p:Product WHERE p.id IN ["prod_laptop", "prod_screen", "prod_keyboard"])
CREATE (o)-[:CONTAINS]->(p);

// Commande 3: Laptop, Screen, Mouse
MATCH (o:Order {id: "order_003"}), (p:Product WHERE p.id IN ["prod_laptop", "prod_screen", "prod_mouse"])
CREATE (o)-[:CONTAINS]->(p);

// Commande 4: Screen, Keyboard
MATCH (o:Order {id: "order_004"}), (p:Product WHERE p.id IN ["prod_screen", "prod_keyboard"])
CREATE (o)-[:CONTAINS]->(p);

// Commande 5: Laptop, Dock, Monitor
MATCH (o:Order {id: "order_005"}), (p:Product WHERE p.id IN ["prod_laptop", "prod_dock", "prod_monitor"])
CREATE (o)-[:CONTAINS]->(p);

// Commande 6: Laptop, Screen, Keyboard, Mouse
MATCH (o:Order {id: "order_006"}), (p:Product WHERE p.id IN ["prod_laptop", "prod_screen", "prod_keyboard", "prod_mouse"])
CREATE (o)-[:CONTAINS]->(p);

// Commande 7: Laptop, Screen, Mousepad
MATCH (o:Order {id: "order_007"}), (p:Product WHERE p.id IN ["prod_laptop", "prod_screen", "prod_mousepad"])
CREATE (o)-[:CONTAINS]->(p);

// Commande 8: Mouse, Mousepad, Cable
MATCH (o:Order {id: "order_008"}), (p:Product WHERE p.id IN ["prod_mouse", "prod_mousepad", "prod_cable_usb"])
CREATE (o)-[:CONTAINS]->(p);

// Commande 9: Keyboard, Mouse
MATCH (o:Order {id: "order_009"}), (p:Product WHERE p.id IN ["prod_keyboard", "prod_mouse"])
CREATE (o)-[:CONTAINS]->(p);

// Commande 10: Keyboard, Mouse (répétition du pattern)
MATCH (o:Order {id: "order_010"}), (p:Product WHERE p.id IN ["prod_keyboard", "prod_mouse"])
CREATE (o)-[:CONTAINS]->(p);

// Commandes 11-15: Variations pour enrichir les données
MATCH (o:Order {id: "order_011"}), (p:Product WHERE p.id IN ["prod_laptop", "prod_screen"])
CREATE (o)-[:CONTAINS]->(p);

MATCH (o:Order {id: "order_012"}), (p:Product WHERE p.id IN ["prod_mouse", "prod_mousepad"])
CREATE (o)-[:CONTAINS]->(p);

MATCH (o:Order {id: "order_013"}), (p:Product WHERE p.id IN ["prod_keyboard", "prod_cable_usb"])
CREATE (o)-[:CONTAINS]->(p);

MATCH (o:Order {id: "order_014"}), (p:Product WHERE p.id IN ["prod_laptop", "prod_hub"])
CREATE (o)-[:CONTAINS]->(p);

MATCH (o:Order {id: "order_015"}), (p:Product WHERE p.id IN ["prod_screen", "prod_keyboard", "prod_mouse"])
CREATE (o)-[:CONTAINS]->(p);

// ==================================================
// 6️⃣ VÉRIFIER LES DONNÉES
// ==================================================

// Compter les produits
MATCH (p:Product) RETURN COUNT(p) as totalProducts;

// Compter les commandes
MATCH (o:Order) RETURN COUNT(o) as totalOrders;

// Compter les associations
MATCH (o:Order)-[:CONTAINS]->(p:Product) 
RETURN COUNT(*) as totalAssociations;

// ==================================================
// 7️⃣ TESTER PHASE 1 - RECOMMANDATIONS
// ==================================================

// Test 1: Panier avec 1 produit (Laptop)
// Résultat attendu: Screen (3x), Dock (1x), etc.
MATCH (p1:Product {id: "prod_laptop"})<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(p2:Product)
WHERE p2.id <> "prod_laptop"
WITH p2, COUNT(DISTINCT o) as frequency
RETURN p2.brand, p2.price, frequency
ORDER BY frequency DESC
LIMIT 5;

// Test 2: Panier avec 2 produits (Laptop + Mouse)
// Résultat attendu: Screen (3x), Mousepad (2x), etc.
MATCH (p1:Product)<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(p2:Product)
WHERE p1.id IN ["prod_laptop", "prod_mouse"] 
  AND p2.id NOT IN ["prod_laptop", "prod_mouse"]
WITH p2, COUNT(DISTINCT o) as coFrequency
RETURN p2.brand, p2.price, coFrequency as score
ORDER BY coFrequency DESC
LIMIT 5;

// Test 3: Voir les co-achats les plus forts
MATCH (p1:Product)<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(p2:Product)
WHERE p1.id < p2.id  // Éviter doublons
WITH p1, p2, COUNT(DISTINCT o) as frequency
ORDER BY frequency DESC
RETURN p1.brand as product1, p2.brand as product2, frequency
LIMIT 10;

// ==================================================
// 8️⃣ REQUÊTE FINALE - PHASE 1 COMPLÈTE
// ==================================================

// Avec les paramètres Cypher (comme depuis l'API)
MATCH (p1:Product)<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(p2:Product)
WHERE p1.id IN ["prod_laptop", "prod_screen"]  // Exemple: panier
  AND p2.id NOT IN ["prod_laptop", "prod_screen"]
WITH p2, COUNT(DISTINCT o) as coFrequency
OPTIONAL MATCH (o_all:Order)-[:CONTAINS]->(p2)
WITH p2, coFrequency, COUNT(DISTINCT o_all) as totalPopularity
RETURN 
  p2.id as id,
  p2.brand as brand, 
  p2.price as price,
  coFrequency as score,
  totalPopularity as popularity,
  'Souvent acheté avec vos produits' as reason
ORDER BY coFrequency DESC, totalPopularity DESC
LIMIT 5;

// ==================================================
// 9️⃣ INDEXES (Optimisation)
// ==================================================

CREATE INDEX product_id IF NOT EXISTS
FOR (p:Product) ON (p.id);

CREATE INDEX category_name IF NOT EXISTS
FOR (c:Category) ON (c.name);

CREATE INDEX order_id IF NOT EXISTS
FOR (o:Order) ON (o.id);

// Vérifier les indexes
SHOW INDEXES;

// ==================================================
// ✅ PRÊT POUR TESTER!
// ==================================================

// Maintenant vous pouvez:
// 1. Lancer le backend: npm start
// 2. Lancer le frontend: npm start
// 3. Ajouter "prod_laptop" au panier
// 4. Voir les recommandations s'afficher

