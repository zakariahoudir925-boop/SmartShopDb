const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'salah1234'
  )
);

async function cleanDatabase() {
  const session = driver.session();
  
  try {
    console.log('🧹 Nettoyage complet de la base de données...');
    
    // Supprimer TOUT
    await session.run('MATCH (n) DETACH DELETE n');
    
    console.log('✅ Base de données complètement nettoyée!');
    
    // Afficher les produits restants
    const result = await session.run('MATCH (p:Product) RETURN COUNT(p) as count');
    const count = result.records[0].get('count').toNumber();
    console.log(`📊 Produits restants: ${count}`);
    
    await session.close();
    driver.close();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
