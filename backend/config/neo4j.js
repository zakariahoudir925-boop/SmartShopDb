// Configuration Neo4j
const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'neo4j://127.0.0.1:7687',  // 🔧 Utiliser neo4j:// au lieu de bolt://
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  ),
  { 
    encrypted: 'ENCRYPTION_OFF',  // Désactiver l'encryption
    disableLosslessIntegers: true,
    maxConnectionPoolSize: 50
  }
);

module.exports = driver;
