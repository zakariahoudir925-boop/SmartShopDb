import React, { useState, useEffect } from 'react';
import { recommendationAPI } from '../api';
import './Basket.css';

function Basket({ items = [], onRemove, onUpdateQuantity }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const loadRecommendations = async () => {
    if (items.length === 0) {
      setRecommendations([]);
      return;
    }

    setLoading(true);
    try {
      const basketIds = items.map(p => p.id);
      const response = await recommendationAPI.getByBasketAdvanced(basketIds, 5);
      setRecommendations(response.data || []);
    } catch (error) {
      console.error('Erreur:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <div className="basket-container">
      <div className="basket-header">
        <h2>🛒 Panier</h2>
        {items.length > 0 && <span className="item-count">{items.length}</span>}
      </div>

      {items.length === 0 ? (
        <div className="empty-basket">
          <p>Votre panier est vide</p>
          <p className="empty-message">Ajoutez des produits pour commencer</p>
        </div>
      ) : (
        <>
          <div className="basket-items">
            {items.map(item => (
              <div key={item.id} className="basket-item">
                <div className="item-info">
                  <div className="item-details">
                    <h4>{item.name || item.brand}</h4>
                    <span className="item-price">{item.price}€ × {item.quantity || 1}</span>
                  </div>
                </div>
                <div className="item-controls">
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                  >
                    −
                  </button>
                  <span className="qty">{item.quantity || 1}</span>
                  <button
                    className="qty-btn"
                    onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                  >
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => onRemove(item.id)}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="basket-footer">
            <div className="basket-total">
              <span>Total:</span>
              <span className="total-price">{total.toFixed(2)}€</span>
            </div>
            <button className="checkout-btn">Procéder au paiement</button>
          </div>
        </>
      )}

      <div className="recommendations-section">
        <h3>✨ Complétez votre commande</h3>

        {items.length === 0 ? (
          <p className="rec-empty">Ajoutez des produits pour voir les recommandations</p>
        ) : loading ? (
          <p className="rec-loading">⏳ Chargement des recommandations...</p>
        ) : recommendations.length === 0 ? (
          <p className="rec-none">Aucune recommandation disponible</p>
        ) : (
          <div className="recommendations-list">
            {recommendations.map(rec => (
              <div key={rec.id} className="recommendation-item">
                <div className="rec-content">
                  <h4>{rec.name || rec.brand}</h4>
                  <p className="rec-price">{rec.price}€</p>
                  {rec.reason && (
                    <p className="rec-reason">
                      <span className="reason-icon">📊</span>
                      {rec.reason}
                    </p>
                  )}
                  {rec.score && (
                    <p className="rec-score">Score: {rec.score} co-achats</p>
                  )}
                </div>
                <button
                  className="add-recommendation-btn"
                  onClick={() => {
                    onUpdateQuantity(rec.id, 1);
                  }}
                >
                  + Ajouter
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Basket;
