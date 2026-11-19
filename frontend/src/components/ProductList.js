import React, { useState, useEffect } from 'react';
import { productAPI } from '../api';
import ProductCard from './ProductCard';
import RecommendationsSection from './RecommendationsSection';
import './ProductListPro.css';

function ProductList({ searchQuery = '', onAddToBasket, token, refreshTrigger = 0 }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductBrand, setSelectedProductBrand] = useState(null);

  useEffect(() => {
    console.log(`[ProductList] ========== LOAD PRODUCTS ==========`);
    console.log(`[ProductList] refreshTrigger:`, refreshTrigger);
    loadProducts();
  }, [refreshTrigger]);

  useEffect(() => {
    filterProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchQuery]);

  const loadProducts = async () => {
    try {
      console.log(`[ProductList] ✅ Chargement des produits...`);
      setLoading(true);
      
      const response = await productAPI.getAll();
      
      console.log(`[ProductList] ✅ Réponse reçue`);
      console.log(`[ProductList] Type response:`, typeof response);
      
      const productsArray = Array.isArray(response.data) ? response.data : (Array.isArray(response) ? response : []);
      
      console.log(`[ProductList] Nombre de produits:`, productsArray.length);
      if (productsArray.length > 0) {
        console.log(`[ProductList] Premier produit:`, productsArray[0]);
        console.log(`[ProductList] imageUrl du premier:`, productsArray[0].imageUrl);
      }
      
      setProducts(productsArray);
      setError(null);
      
    } catch (err) {
      console.error(`[ProductList] ❌ Erreur:`, err.message);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      (product.brand && product.brand.toLowerCase().includes(query)) ||
      (product.name && product.name.toLowerCase().includes(query)) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
  };

  const handleAddToBasket = (product) => {
    setSelectedProductId(product.id);
    setSelectedProductBrand(product.brand || product.name);
    onAddToBasket(product);
  };

  // ✅ FONCTION POUR GÉNÉRER UNE IMAGE PLACEHOLDER UNIQUE
  const generatePlaceholder = (productId) => {
    const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E2'];
    const colorIndex = (productId.charCodeAt(0) + productId.length) % colors.length;
    const color = colors[colorIndex];
    return `https://via.placeholder.com/200x200/${color}/FFFFFF?text=${productId.substring(0, 8)}`;
  };

  if (loading) {
    return <div className="loading">⏳ Chargement des produits...</div>;
  }

  if (error) {
    return <div className="error">❌ {error}</div>;
  }

  return (
    <div className="product-list-container">
      <div className="products-header">
        <h2>📦 Produits Disponibles</h2>
        <p className="product-count">
          {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>Aucun produit ne correspond à votre recherche.</p>
          <button 
            onClick={() => setFilteredProducts(products)}
            className="reset-button"
          >
            ↻ Réinitialiser
          </button>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {filteredProducts.map(product => {
              // ✅ SI imageUrl existe, l'utiliser. SINON, générer un placeholder
              let imageUrl = product.imageUrl 
                ? (product.imageUrl.startsWith('/') 
                  ? `http://localhost:5000${product.imageUrl}`
                  : product.imageUrl)
                : generatePlaceholder(product.id);
              
              return (
                <ProductCard
                  key={product.id}
                  product={{...product, imageUrl}}
                  onAddToBasket={handleAddToBasket}
                />
              );
            })}
          </div>
          {selectedProductId && (
            <RecommendationsSection 
              productId={selectedProductId} 
              productBrand={selectedProductBrand}
              onAddToBasket={handleAddToBasket}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;
