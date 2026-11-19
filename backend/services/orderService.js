class OrderService {
  constructor(driver) {
    this.driver = driver;
  }

  // Récupérer une commande
  async getOrder(orderId) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (o:Order {id: $orderId})-[:CONTAINS]->(p:Product)
         RETURN o.id as orderId, COLLECT({id: p.id, brand: p.brand, price: p.price}) as products`,
        { orderId }
      );
      if (result.records.length === 0) return null;
      const record = result.records[0];
      return {
        id: record.get('orderId'),
        products: record.get('products')
      };
    } finally {
      await session.close();
    }
  }

  // Créer une commande avec des produits
  async createOrder(orderId, productIds) {
    const session = this.driver.session();
    try {
      // Créer la commande
      await session.run(
        'CREATE (o:Order {id: $orderId})',
        { orderId }
      );

      // Ajouter les relations CONTAINS
      for (const productId of productIds) {
        await session.run(
          `MATCH (o:Order {id: $orderId}), (p:Product {id: $productId})
           CREATE (o)-[:CONTAINS]->(p)`,
          { orderId, productId }
        );
      }

      return await this.getOrder(orderId);
    } finally {
      await session.close();
    }
  }

  // Récupérer tous les produits d'une commande
  async getOrderProducts(orderId) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (o:Order {id: $orderId})-[:CONTAINS]->(p:Product)
         RETURN p.id as id, p.brand as brand, p.price as price`,
        { orderId }
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
}

module.exports = OrderService;
