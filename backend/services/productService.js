const neo4j = require('neo4j-driver');

class ProductService {
  constructor(driver) {
    this.driver = driver;
  }

  // Récupérer tous les produits (sans limite fixe)
  async getAllProducts(limit = null) {
    const session = this.driver.session();
    try {
      console.log(`[ProductService] getAllProducts START - limit: ${limit || 'NONE (ALL PRODUCTS)'}`);
      
      // Construire la requête Cypher dynamiquement
      let cypher = `
        MATCH (p:Product)
        RETURN p {
          id: p.id,
          brand: p.brand,
          price: p.price,
          name: p.brand,
          created_at: p.created_at,
          updated_at: p.updated_at
        } AS product
        ORDER BY p.updated_at DESC
      `;
      
      // Ajouter LIMIT seulement si limit est fourni et > 0
      const params = {};
      if (limit && limit > 0) {
        cypher += ` LIMIT $limit`;
        params.limit = neo4j.int(limit);
      }
      
      const result = await session.run(cypher, params);
      
      const products = result.records.map(record => 
        record.get('product')
      );
      
      console.log(`[ProductService] ✅ Produits retournés:`);
      console.log(`  - Total: ${products.length}`);
      if (products.length > 0) {
        console.log(`  - Premier (plus récent): ${products[0].id} (${products[0].brand})`);
        console.log(`  - Dernier: ${products[products.length - 1].id}`);
      }
      
      return products;
    } catch (error) {
      console.error(`[ProductService] ❌ ERREUR getAllProducts:`, error.message);
      throw error;
    } finally {
      await session.close();
    }
  }

  // Récupérer un produit par ID
  async getProductById(productId) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        'MATCH (p:Product {id: $productId}) RETURN p.id as id, p.brand as brand, p.price as price',
        { productId }
      );
      if (result.records.length === 0) return null;
      const record = result.records[0];
      return {
        id: record.get('id'),
        brand: record.get('brand'),
        price: record.get('price')
      };
    } finally {
      await session.close();
    }
  }

  // Créer ou mettre à jour un produit avec MERGE (garantit unicité)
  async createProduct(id, brand, price, category = null, imageUrl = null) {
    const session = this.driver.session();
    
    try {
      console.log(`\n[ProductService] ========== START createProduct ==========`);
      console.log(`[ProductService] Input params:`);
      console.log(`  - id: "${id}"`);
      console.log(`  - brand: "${brand}"`);
      console.log(`  - price: ${price}`);
      console.log(`  - category: "${category}"`);
      console.log(`  - imageUrl: "${imageUrl}"`);

      // Étape 1 : Créer/mettre à jour le produit
      console.log(`[ProductService] Étape 1: MERGE Product node...`);
      const mergeResult = await session.run(
        `MERGE (p:Product {id: $id})
         SET p.brand = $brand,
             p.price = $price,
             p.imageUrl = $imageUrl,
             p.created_at = COALESCE(p.created_at, datetime()),
             p.updated_at = datetime()
         RETURN p`,
        { id, brand, price, imageUrl }
      );

      if (!mergeResult.records || mergeResult.records.length === 0) {
        throw new Error("MERGE Product failed - no records returned");
      }

      const productNode = mergeResult.records[0].get('p');
      const productProps = productNode.properties;
      
      console.log(`[ProductService] ✅ Produit créé/mis à jour:`);
      console.log(`[ProductService] Properties:`, productProps);

      // Étape 2 : Créer/vérifier la catégorie
      if (category) {
        console.log(`[ProductService] Étape 2: MERGE Category node...`);
        await session.run(
          `MERGE (c:Category {name: $category})
           RETURN c`,
          { category }
        );
        console.log(`[ProductService] ✅ Catégorie créée/vérifiée`);

        // Étape 3 : Créer la relation
        console.log(`[ProductService] Étape 3: CREATE relation BELONGS_TO...`);
        const relResult = await session.run(
          `MATCH (p:Product {id: $id})
           MATCH (c:Category {name: $category})
           MERGE (p)-[:BELONGS_TO]->(c)
           RETURN p, c`,
          { id, category }
        );

        if (!relResult.records || relResult.records.length === 0) {
          throw new Error("Failed to create BELONGS_TO relationship");
        }
        console.log(`[ProductService] ✅ Relation BELONGS_TO créée`);
      }

      // Étape 4 : Vérifier que le produit existe
      console.log(`[ProductService] Étape 4: VÉRIFICATION du produit en base...`);
      const verifyResult = await session.run(
        `MATCH (p:Product {id: $id})
         RETURN p`,
        { id }
      );

      if (verifyResult.records.length === 0) {
        throw new Error(`VÉRIFICATION ÉCHOUÉE: Le produit "${id}" n'existe pas après MERGE!`);
      }

      const verifiedProduct = verifyResult.records[0].get('p').properties;
      console.log(`[ProductService] ✅ VÉRIFICATION OK - Produit existe en base:`);
      console.log(`[ProductService] Produit vérifié:`, verifiedProduct);

      console.log(`[ProductService] ========== END createProduct (SUCCESS) ==========\n`);

      return {
        id: verifiedProduct.id,
        brand: verifiedProduct.brand,
        price: verifiedProduct.price,
        category: category || null
      };

    } catch (error) {
      console.error(`\n[ProductService] ❌ ERREUR CRITIQUE:`);
      console.error(`[ProductService] Message: ${error.message}`);
      console.error(`[ProductService] Stack: ${error.stack}`);
      console.error(`[ProductService] ========== END createProduct (FAILED) ==========\n`);
      throw error;
    } finally {
      await session.close();
    }
  }

  // Récupérer les catégories d'un produit
  async getProductCategories(productId) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (p:Product {id: $productId})-[:BELONGS_TO]->(c:Category)
         RETURN c.name as name`,
        { productId }
      );
      return result.records.map(record => ({
        name: record.get('name')
      }));
    } finally {
      await session.close();
    }
  }

  // Récupérer les produits par catégorie
  async getProductsByCategory(categoryName) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (p:Product)-[:BELONGS_TO]->(c:Category {name: $categoryName})
         RETURN p.id as id, p.brand as brand, p.price as price`,
        { categoryName }
      );
      return result.records.map(record => ({
        id: record.get('id'),
        brand: record.get('brand'),
        price: record.get('price')
      }));
    } finally {
      await session.close();
    }
  }

  // ✅ METTRE À JOUR UN PRODUIT (ADMIN)
  async updateProduct(id, brand, price, category, imageUrl = null) {
    const session = this.driver.session();
    try {
      console.log("[ProductService] ========== UPDATE PRODUIT ==========");
      console.log("[ProductService] ID:", id);
      console.log("[ProductService] Brand:", brand);
      console.log("[ProductService] Price:", price);
      console.log("[ProductService] Category:", category);
      console.log("[ProductService] ImageUrl:", imageUrl);

      // ✅ CONSTRUIRE LA REQUÊTE DYNAMIQUEMENT
      let cypher;
      let params = {
        id,
        brand,
        price,
        category
      };

      // Si imageUrl fourni, mettre à jour aussi l'image
      if (imageUrl) {
        cypher = `
          MATCH (p:Product {id: $id})
          SET p.brand = $brand, 
              p.price = $price,
              p.imageUrl = $imageUrl,
              p.updated_at = datetime()
          RETURN p
        `;
        params.imageUrl = imageUrl;
      } else {
        cypher = `
          MATCH (p:Product {id: $id})
          SET p.brand = $brand, 
              p.price = $price,
              p.updated_at = datetime()
          RETURN p
        `;
      }

      const result = await session.run(cypher, params);

      if (result.records.length === 0) {
        throw new Error("Produit introuvable");
      }

      // Mettre à jour la catégorie si elle change
      if (category) {
        console.log("[ProductService] Mise à jour de la catégorie:", category);
        
        // Créer/vérifier la catégorie
        await session.run(
          `MERGE (c:Category {name: $category})
           RETURN c`,
          { category }
        );

        // Supprimer les anciennes relations BELONGS_TO
        await session.run(
          `MATCH (p:Product {id: $id})-[r:BELONGS_TO]->()
           DELETE r`,
          { id }
        );

        // Créer la nouvelle relation
        await session.run(
          `MATCH (p:Product {id: $id})
           MATCH (c:Category {name: $category})
           MERGE (p)-[:BELONGS_TO]->(c)
           RETURN p, c`,
          { id, category }
        );

        console.log("[ProductService] ✅ Catégorie mise à jour");
      }

      const product = result.records[0].get('p').properties;
      console.log("[ProductService] ✅ Produit mis à jour avec succès:", id);
      console.log("[ProductService] ========== UPDATE PRODUIT (SUCCESS) ==========");

      return {
        success: true,
        message: "Produit mis à jour avec succès",
        product
      };

    } catch (error) {
      console.error("[ProductService] ❌ Erreur UPDATE:", error.message);
      console.error("[ProductService] ========== UPDATE PRODUIT (ERROR) ==========");
      throw error;
    } finally {
      await session.close();
    }
  }
}

module.exports = ProductService;
