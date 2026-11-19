import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ProductList from './ProductList';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import Recommendation from './Recommendation';

function Shop({ user, token, onLogout }) {
  console.log("╔════════════════════════════════════════╗");
  console.log("║  [Shop] 🏪 COMPONENT MOUNTED          ║");
  console.log("╚════════════════════════════════════════╝");
  console.log("[Shop] Token reçu:", !!token ? "✅ OUI" : "❌ NON");
  console.log("[Shop] User:", user?.email);
  
  const [basket, setBasket] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [refreshProducts, setRefreshProducts] = useState(0);
  const [cartRefresh, setCartRefresh] = useState(0);

  // ✅ ÉTAPE 1: Load basket from localStorage
  useEffect(() => {
    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
      try {
        const parsed = JSON.parse(savedBasket);
        setBasket(parsed);
        console.log("[Shop] ✅ Basket chargé depuis localStorage:", parsed.length, "articles");
      } catch (error) {
        console.error('[Shop] Erreur parsing localStorage:', error);
      }
    } else {
      console.log("[Shop] ℹ️  localStorage vide");
    }
  }, []);

  // ✅ ÉTAPE 2: Listen for custom basketUpdated event (from Recommendation.js fallback)
  useEffect(() => {
    const handleBasketUpdate = () => {
      console.log("[Shop] 🔔 Event 'basketUpdated' reçu");
      const updatedBasket = localStorage.getItem('basket');
      if (updatedBasket) {
        try {
          const parsed = JSON.parse(updatedBasket);
          setBasket(parsed);
          console.log("[Shop] ✅ Basket mis à jour depuis event:", parsed.length, "articles");
          setCartRefresh(prev => prev + 1);
        } catch (error) {
          console.error('[Shop] Erreur parsing:', error);
        }
      }
    };

    window.addEventListener('basketUpdated', handleBasketUpdate);
    return () => window.removeEventListener('basketUpdated', handleBasketUpdate);
  }, []);

  // ✅ ÉTAPE 3: Save basket to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(basket));
    console.log("[Shop] 💾 Basket sauvegardé en localStorage:", basket.length, "articles");
  }, [basket]);

  const addToBasket = (product) => {
    console.log("╔═════════════════════════════════════════╗");
    console.log("║  [Shop] 🛒 addToBasket APPELÉE         ║");
    console.log("╚═════════════════════════════════════════╝");
    console.log("[Shop] ⏰ Timestamp:", new Date().toISOString());
    console.log("[Shop] Produit:", product?.brand);
    console.log("[Shop] ID:", product?.id);
    console.log("[Shop] Prix:", product?.price);
    console.log("[Shop] Basket avant:", basket.length, "articles");

    if (!product) {
      console.error("[Shop] ❌ ERREUR: Produit NULL/UNDEFINED");
      return;
    }

    const existingItem = basket.find(item => item.id === product.id);
    if (existingItem) {
      console.log("[Shop] ✏️ Produit existe déjà, quantity +1");
      const updatedBasket = basket.map(item =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
      setBasket(updatedBasket);
      console.log("[Shop] ✅ Basket mis à jour, total:", updatedBasket.length);
    } else {
      console.log("[Shop] ➕ Nouveau produit");
      const updatedBasket = [...basket, { ...product, quantity: 1 }];
      setBasket(updatedBasket);
      console.log("[Shop] ✅ Basket mis à jour, total:", updatedBasket.length);
    }

    // ✅ DÉCLENCHER LA MISE À JOUR DU PANIER
    setCartRefresh(prev => prev + 1);
    console.log("[Shop] 🔄 CartDrawer va se mettre à jour");
  };

  const removeFromBasket = (productId) => {
    setBasket(basket.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    const total = basket.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    setOrderTotal(total);
    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setBasket([]);
  };

  const cartItemCount = basket.length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        cartCount={cartItemCount}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        onSearch={setSearchQuery}
        onLogout={onLogout}
        userEmail={user?.email}
        isAdmin={user?.role === 'ADMIN'}
      />

      {/* Products Section */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <ProductList
          searchQuery={searchQuery}
          onAddToBasket={addToBasket}
          token={token}
          refreshTrigger={refreshProducts}
        />

        {/* ✅ AJOUTER LE COMPOSANT RECOMMENDATION */}
        <Recommendation 
          token={token}
          onProductAdded={addToBasket}
        />
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={basket}
        onClose={() => setIsCartOpen(false)}
        removeFromBasket={removeFromBasket}
        onCheckout={handleCheckout}
        refreshTrigger={cartRefresh}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        total={orderTotal}
        onClose={handleCloseCheckout}
      />
    </div>
  );
}

export default Shop;
