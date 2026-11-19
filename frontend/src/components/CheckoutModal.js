import React, { useEffect, useState } from 'react';
import './CheckoutModalPro.css';

function CheckoutModal({ isOpen, onClose, total = 0 }) {
  const [orderNumber] = useState(() => {
    const random = Math.floor(Math.random() * 900000) + 100000;
    return `${random}`;
  });

  useEffect(() => {
    if (isOpen && total === 0) {
      // Simulate processing
      const timer = setTimeout(() => {
        // Modal stays open until user clicks
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, total]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box success-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-checkmark">✓</div>
        
        <h2 className="modal-title">Order Confirmed</h2>
        <p className="modal-subtitle">Thank you for your purchase</p>

        <div className="order-summary">
          <div className="summary-item">
            <span className="label">Order Number</span>
            <span className="value">#{ orderNumber}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Amount</span>
            <span className="value amount">${(total || 0).toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span className="label">Estimated Delivery</span>
            <span className="value">3-5 business days</span>
          </div>
        </div>

        <div className="confirmation-message">
          <p>A confirmation email has been sent to your inbox. You can track your order from there.</p>
        </div>

        <button className="btn-primary modal-close-btn" onClick={onClose}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default CheckoutModal;
