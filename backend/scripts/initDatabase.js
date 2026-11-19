const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'salah1234'
  )
);

async function initDatabase() {
  const session = driver.session();
  
  try {
    // Vérifier s'il y a déjà des produits
    const existingProducts = await session.run('MATCH (p:Product) RETURN COUNT(p) as count');
    const productCount = existingProducts.records[0].get('count').toNumber();
    
    if (productCount > 0) {
      console.log(`✅ ${productCount} produits existants détectés - Préservation des données`);
      console.log('✅ Utilisation des données de Neo4j Desktop');
      await session.close();
      driver.close();
      return;
    }

    console.log('🗑️  Suppression des données existantes...');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log('📝 Création des catégories de test...');
    const categories = ['Électronique', 'Mode', 'Sports', 'Maison', 'Livres'];
    for (const category of categories) {
      await session.run(
        'CREATE (c:Category {name: $name})',
        { name: category }
      );
    }

    console.log('📦 Création des produits...');
    const products = [
      { id: '1515966223509089906', brand: 'samsung', price: 162.01 },
      { id: '2273948319057183658', brand: 'huawei', price: 77.52 },
      { id: '2273948316817424439', brand: 'karcher', price: 217.57 },
      { id: '1515966223509259400', brand: 'lg', price: 370.35 },
      { id: '1515966223509259401', brand: 'different', price: 104.14 },
      { id: '1515966223509223889', brand: 'lg', price: 381.92 },
      { id: '1515966223509616509', brand: 'tvs', price: 85.63 },
      { id: '1515966223509104277', brand: 'vertex', price: 11.32 }
    ];

    for (const product of products) {
      await session.run(
        'CREATE (p:Product {id: $id, brand: $brand, price: $price})',
        product
      );
    }

    console.log('🔗 Création des relations BELONGS_TO...');
    const relationships = [
      { product: '1515966223509089906', category: 'Électronique' },
      { product: '2273948319057183658', category: 'Électronique' },
      { product: '2273948316817424439', category: 'Électronique' },
      { product: '1515966223509259400', category: 'Électronique' },
      { product: '1515966223509259401', category: 'Électronique' },
      { product: '1515966223509223889', category: 'Électronique' },
      { product: '1515966223509616509', category: 'Électronique' },
      { product: '1515966223509104277', category: 'Électronique' }
    ];

    for (const rel of relationships) {
      await session.run(
        `MATCH (p:Product {id: $product}), (c:Category {name: $category})
         CREATE (p)-[:BELONGS_TO]->(c)`,
        rel
      );
    }

    console.log('📋 Création des commandes...');
    const orders = [
      { id: 'O1', products: ['1515966223509089906', '2273948319057183658'] },
      { id: 'O2', products: ['2273948316817424439', '1515966223509259400'] },
      { id: 'O3', products: ['1515966223509259401', '1515966223509616509'] },
      { id: 'O4', products: ['1515966223509089906', '1515966223509104277'] },
      { id: 'O5', products: ['2273948319057183658', '2273948316817424439', '1515966223509223889'] }
    ];

    for (const order of orders) {
      await session.run(
        'CREATE (o:Order {id: $id})',
        { id: order.id }
      );

      for (const productId of order.products) {
        await session.run(
          `MATCH (o:Order {id: $orderId}), (p:Product {id: $productId})
           CREATE (o)-[:CONTAINS]->(p)`,
          { orderId: order.id, productId }
        );
      }
    }

    console.log('✅ Base de données initialisée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

initDatabase();
