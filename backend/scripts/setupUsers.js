const neo4j = require('neo4j-driver');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Config
const config = require('../config/config');
const driver = neo4j.driver(
  config.neo4j.uri,
  neo4j.auth.basic(config.neo4j.user, config.neo4j.password)
);

async function setupTestUsers() {
  const session = driver.session();
  try {
    console.log('Creating test users in Neo4j...');

    // Admin user
    const adminPassword = await bcrypt.hash('password', 10);
    await session.run(
      `MERGE (u:User {email: $email})
       SET u.id = $id, u.password_hash = $passwordHash, u.role = $role, u.created_at = timestamp()
       RETURN u`,
      {
        email: 'admin@shop.com',
        id: 'user_admin_001',
        passwordHash: adminPassword,
        role: 'ADMIN'
      }
    );
    console.log('✓ Admin user created: admin@shop.com / password');

    // Client user 1
    const clientPassword1 = await bcrypt.hash('password', 10);
    await session.run(
      `MERGE (u:User {email: $email})
       SET u.id = $id, u.password_hash = $passwordHash, u.role = $role, u.created_at = timestamp()
       RETURN u`,
      {
        email: 'client@example.com',
        id: 'user_client_001',
        passwordHash: clientPassword1,
        role: 'CLIENT'
      }
    );
    console.log('✓ Client user created: client@example.com / password');

    // Client user 2
    const clientPassword2 = await bcrypt.hash('password', 10);
    await session.run(
      `MERGE (u:User {email: $email})
       SET u.id = $id, u.password_hash = $passwordHash, u.role = $role, u.created_at = timestamp()
       RETURN u`,
      {
        email: 'john@example.com',
        id: 'user_client_002',
        passwordHash: clientPassword2,
        role: 'CLIENT'
      }
    );
    console.log('✓ Client user created: john@example.com / password');

    console.log('\nAll test users created successfully!');
    console.log('\nYou can now login with:');
    console.log('  Admin: admin@shop.com / password');
    console.log('  Client: client@example.com / password');
    console.log('  Client: john@example.com / password');
  } catch (error) {
    console.error('Error setting up users:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

setupTestUsers();
