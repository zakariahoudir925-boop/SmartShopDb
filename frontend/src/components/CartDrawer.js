import React from 'react';
import CartRecommendations from './CartRecommendations';
import './CartDrawerPro.css';

function CartDrawer({ isOpen, items, onClose, onCheckout, onAddToBasket, refreshTrigger }) {
  console.log("[CartDrawer] 🔄 Rendu avec", items.length, "articles, refreshTrigger:", refreshTrigger);
  
  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose}></div>}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Your Cart</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        <div className="drawer-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛍️</div>
              <h3>Your cart is empty</h3>
              <p>Start shopping to see items here</p>
              <button className="btn-primary" onClick={onClose} style={{ marginTop: '1rem' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image"></div>
                  <div className="item-info">
                    <h4>{item.name || item.brand}</h4>
                    <p className="item-price">${item.price}</p>
                  </div>
                  <div className="item-quantity">
                    <span>Qty: {item.quantity || 1}</span>
                  </div>
                  <div className="item-total">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <CartRecommendations 
              items={items} 
              onAddToBasket={onAddToBasket}
            />
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button className="btn-primary checkout-btn" onClick={onCheckout}>
              Checkout
            </button>
            <button className="btn-secondary continue-shopping-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
