import React, { useState, useEffect } from 'react';
import EditProduct from './EditProduct';
import './ManageProducts.css';

export default function ManageProducts({ token, refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    console.log('[ManageProducts] useEffect triggered, refreshTrigger:', refreshTrigger);
    loadProducts();
  }, [refreshTrigger]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('[ManageProducts] Chargement des produits...');
      
      const response = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      console.log('[ManageProducts] Produits chargés:', data.length);
      
      setProducts(data);
    } catch (error) {
      console.error('[ManageProducts] Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le produit ${productId}?`)) {
      return;
    }

    setDeleting(productId);

    try {
      console.log('[ManageProducts] Suppression du produit:', productId);
      
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        console.log('[ManageProducts] Produit supprimé avec succès');
        alert('✅ Produit supprimé avec succès');
        loadProducts();
      } else {
        const error = await response.json();
        alert('❌ Erreur: ' + (error.message || 'Impossible de supprimer'));
      }
    } catch (error) {
      console.error('[ManageProducts] Erreur lors de la suppression:', error);
      alert('❌ Erreur lors de la suppression: ' + error.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleProductUpdated = () => {
    console.log("[ManageProducts] Produit mis à jour, rechargement...");
    setEditingProductId(null);
    loadProducts();
  };

  const filteredProducts = products.filter(p =>
    p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">⏳ Chargement...</div>;

  return (
    <div className="manage-products-container">
      <div className="manage-header">
        <h2>Gérer les Produits</h2>
        <input
          type="text"
          placeholder="🔍 Rechercher par ID ou marque..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="products-table-wrapper">
        {filteredProducts.length === 0 ? (
          <div className="empty-message">
            <p>Aucun produit trouvé</p>
          </div>
        ) : (
          <table className="products-manage-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>ID</th>
                <th>Marque</th>
                <th>Prix</th>
                <th>Catégorie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => {
                const imageUrl = product.imageUrl 
                  ? `http://localhost:5000${product.imageUrl}`
                  : '/images/placeholder.png';
                
                console.log('[ManageProducts] Produit:', product.id, '- imageUrl:', product.imageUrl, '- URL finale:', imageUrl);
                
                return (
                <tr key={product.id}>
                  <td className="image-cell">
                    <img 
                      src={imageUrl}
                      alt={product.brand}
                      className="product-thumb"
                      onError={(e) => {
                        console.error('[ManageProducts] Image introuvable:', imageUrl);
                        e.target.src = '/images/placeholder.png';
                      }}
                    />
                  </td>
                  <td className="id-cell">{product.id}</td>
                  <td className="brand-cell">{product.brand}</td>
                  <td className="price-cell">${product.price.toFixed(2)}</td>
                  <td className="category-cell">{product.category}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit"
                      onClick={() => setEditingProductId(product.id)}
                      disabled={deleting === product.id}
                      title="Modifier"
                    >
                      ✏️ Éditer
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                    >
                      {deleting === product.id ? '⏳' : '🗑️'} Supprimer
                    </button>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        )}
      </div>

      <div className="products-info">
        <p>Total: <strong>{filteredProducts.length}</strong> / {products.length} produit(s)</p>
      </div>

      {/* ✅ MODAL ÉDITION */}
      {editingProductId && (
        <EditProduct
          token={token}
          productId={editingProductId}
          onProductUpdated={handleProductUpdated}
          onCancel={() => setEditingProductId(null)}
        />
      )}
    </div>
  );
}
