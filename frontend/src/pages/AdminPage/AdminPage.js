import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import './AdminPage.css';

export default function AdminPage({ token, user, onLogout }) {
  const [activeTab, setActiveTab] = useState('add-product');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Vérifier que c'est un admin
  if (user?.role !== 'ADMIN') {
    return (
      <div className="admin-access-denied">
        <h2>Accès Refusé</h2>
        <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
      </div>
    );
  }

  const handleProductAdded = () => {
    console.log('[AdminPage] Product added - triggering refresh');
    setRefreshTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'add-product':
        return <AddProduct token={token} onProductAdded={handleProductAdded} />;
      case 'manage-products':
        return <ManageProducts token={token} refreshTrigger={refreshTrigger} />;
      default:
        return <AddProduct token={token} onProductAdded={handleProductAdded} />;
    }
  };

  return (
    <div className="admin-page">
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        onLogout={onLogout}
      />
      <div className="admin-content">
        <div className="admin-header">
          <h1>Panneau d'Administration</h1>
          <div className="admin-user-info">
            <span>👤 {user?.email}</span>
          </div>
        </div>
        <div className="admin-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
