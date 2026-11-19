import React, { useState, useEffect } from 'react';
import { recommendationAPI } from '../api';
import ProductCard from './ProductCard';
import './CartRecommendationsPro.css';

function CartRecommendations({ items, onAddToBasket }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0) {
      setRecommendations([]);
      return;
    }

    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const firstProduct = items[0];
        if (!firstProduct || !firstProduct.id) {
          setRecommendations([]);
          return;
        }

        const response = await recommendationAPI.getByProductId(firstProduct.id);
        const recs = response.data || [];
        
        const basketIds = new Set(items.map(item => item.id));
        const filtered = recs.filter(rec => !basketIds.has(rec.id)).slice(0, 3);
        
        setRecommendations(filtered);
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [items]);

  if (!items || items.length === 0 || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="cart-recommendations">
      <h3>You Might Also Like</h3>
      <div className="recommendations-carousel">
        {loading ? (
          <div className="loading-state">Loading suggestions...</div>
        ) : (
          recommendations.map(product => (
            <div key={product.id} className="carousel-item">
              <ProductCard 
                product={product}
                onAddToBasket={onAddToBasket}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CartRecommendations;
