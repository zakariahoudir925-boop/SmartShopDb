import React from 'react';
import './ProductCardPro.css';

function ProductCard({ product, onAddToBasket }) {
  const handleAddClick = () => {
    if (onAddToBasket) {
      onAddToBasket(product);
    }
  };

  // Construire l'URL de l'image
  const imageUrl = product.imageUrl 
    ? `http://localhost:5000${product.imageUrl}`
    : '/images/placeholder.png';

  console.log('[ProductCard] Produit:', product.id, '- imageUrl:', product.imageUrl, '- URL finale:', imageUrl);

  const renderRating = (rating) => {
    if (!rating) return null;
    const stars = Math.round(rating);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <div className="product-card">
      <div className="card-image-wrapper">
        <img 
          src={imageUrl}
          alt={product.brand || product.name}
          className="card-image"
          onLoad={() => console.log('[IMG] Chargée:', imageUrl)}
          onError={() => console.error('[IMG] ❌ Erreur chargement:', imageUrl)}
        />
      </div>
      
      <div className="card-content">
        <h3 className="product-name">{product.name || product.brand}</h3>
        
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        
        {product.rating && (
          <div className="product-rating">
            <span className="stars">{renderRating(product.rating)}</span>
            <span className="rating-value">({product.rating.toFixed(1)})</span>
          </div>
        )}
        
        <div className="card-footer">
          <span className="product-price">${product.price}</span>
          <button
            className="btn-primary add-to-cart-btn"
            onClick={handleAddClick}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
