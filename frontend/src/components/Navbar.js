import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavbarPro.css';

function Navbar({ 
  cartCount = 0, 
  onCartClick = () => {}, 
  onSearch = () => {}, 
  onLogout, 
  userEmail,
  isAdmin = false,
  onAdminPanelToggle = () => {}
}) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">SmartShop</div>

        <div className="navbar-search">
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchValue}
            onChange={handleSearchChange}
          />
          {searchValue && (
            <button className="search-clear" onClick={handleClear}>✕</button>
          )}
        </div>

        <div className="navbar-actions">
          {isAdmin && (
            <Link
              to="/admin"
              style={{
                padding: '8px 16px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginRight: '10px',
                transition: 'background-color 0.3s',
                textDecoration: 'none',
                display: 'inline-block'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#5568d3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
            >
              ⚙️ Admin Panel
            </Link>
          )}

          <button 
            className="cart-button"
            onClick={onCartClick}
            aria-label="Shopping cart"
          >
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>

          {onLogout && (
            <button 
              className="logout-button"
              onClick={onLogout}
              aria-label="Logout"
              style={{
                padding: '8px 16px',
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginLeft: '10px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#b71c1c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
