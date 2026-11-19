import React from 'react';
import './AdminSidebar.css';

export default function AdminSidebar({ activeTab, setActiveTab, user, onLogout }) {
  const menuItems = [
    { id: 'add-product', label: '➕ Ajouter Produit', icon: '➕' },
    { id: 'manage-products', label: '📦 Gérer Produits', icon: '📦' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>🛍️ SmartShop</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  );
}
