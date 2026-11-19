import React, { useState, useEffect } from 'react';

export default function Dashboard({ token, refreshTrigger }) {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    avgPrice: 0,
    recentProducts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const loadStats = async () => {
    try {
      setLoading(true);
      console.log('[Dashboard] ========== Chargement des stats ==========');
      
      const response = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const products = await response.json();

      console.log('[Dashboard] ✅ Produits chargés:', products.length);
      if (products.length > 0) {
        console.log('[Dashboard] Premier produit:', products[0]);
      }

      const totalProducts = products.length;
      const categories = [...new Set(products.map(p => p.category))].length;
      const avgPrice = totalProducts > 0 
        ? (products.reduce((sum, p) => sum + p.price, 0) / totalProducts).toFixed(2)
        : 0;
      const recentProducts = products.slice(0, 5);

      console.log('[Dashboard] Stats calculées:', { totalProducts, categories, avgPrice });

      setStats({
        totalProducts,
        totalCategories: categories,
        avgPrice,
        recentProducts
      });
    } catch (error) {
      console.error('[Dashboard] ❌ Erreur lors du chargement des stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">⏳ Chargement...</div>;

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Produits</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-info">
            <h3>Catégories</h3>
            <p className="stat-value">{stats.totalCategories}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Prix Moyen</h3>
            <p className="stat-value">${stats.avgPrice}</p>
          </div>
        </div>
      </div>

      <div className="recent-products">
        <h2>Produits Récents</h2>
        {stats.recentProducts.length === 0 ? (
          <p className="empty-message">Aucun produit trouvé</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>ID</th>
                <th>Marque</th>
                <th>Prix</th>
                <th>Catégorie</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentProducts.map(product => {
                const imageUrl = product.imageUrl 
                  ? `http://localhost:5000${product.imageUrl}`
                  : '/images/placeholder.png';
                
                return (
                <tr key={product.id}>
                  <td className="image-cell">
                    <img 
                      src={imageUrl}
                      alt={product.brand}
                      className="product-thumb"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                  </td>
                  <td>{product.id}</td>
                  <td>{product.brand}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.category}</td>
                </tr>
              );})}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
