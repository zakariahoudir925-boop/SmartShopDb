import React, { useState, useEffect } from 'react';
import { recommendationAPI } from '../api';
import './RecommendationsSectionPro.css';
import ProductCard from './ProductCard';

function RecommendationsSection({ productId, onAddToBasket }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) {
      setRecommendations([]);
      return;
    }

    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const response = await recommendationAPI.getByProductId(productId);
        const recs = response.data || [];
        setRecommendations(recs);
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [productId]);

  if (!productId || (!loading && recommendations.length === 0)) {
    return null;
  }

  return (
    <section className="recommendations-section">
      <div className="recommendations-container">
        <h2 className="recommendations-title">Customers Also Bought</h2>
        
        {loading ? (
          <div className="skeleton-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        ) : (
          <div className="recommendations-grid">
            {recommendations.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                onAddToBasket={onAddToBasket}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RecommendationsSection;
