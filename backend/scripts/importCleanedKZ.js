const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const driver = require('../config/neo4j');

async function importCleanedKZ() {
  const csvPath = path.join(__dirname, '../cleaned_kz.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ cleaned_kz.csv non trouvé');
    process.exit(1);
  }

  const session = driver.session();
  let count = 0;

  try {
    // Vider les produits existants
    await session.run('MATCH (p:Product) DETACH DELETE p');
    console.log('🗑️  Produits anciens supprimés');

    // Importer les nouveaux produits
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const productId = row.product_id || row['product_id'];
          const brand = row.brand || row.Brand;
          const price = parseFloat(row.price || row.Price || 0);

          if (productId && brand) {
            await session.run(
              'CREATE (p:Product {id: $id, brand: $brand, price: $price})',
              { id: productId.toString(), brand, price }
            );
            count++;
            console.log(`✅ ${brand} (${productId}) importé - Total: ${count}`);
          }
        } catch (err) {
          console.error('❌ Erreur import ligne:', err.message);
        }
      })
      .on('end', async () => {
        console.log(`\n✅ ${count} produits importés avec succès !`);
        await session.close();
        driver.close();
        process.exit(0);
      })
      .on('error', (err) => {
        console.error('❌ Erreur CSV:', err);
        process.exit(1);
      });
  } catch (err) {
    console.error('❌ Erreur:', err);
    await session.close();
    driver.close();
    process.exit(1);
  }
}

importCleanedKZ();
