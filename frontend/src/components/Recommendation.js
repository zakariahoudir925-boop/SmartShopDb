import React, { useState, useEffect } from 'react';
import './Recommendation.css';

export default function Recommendation({ token, onProductAdded }) {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ ÉTAPE 1: Vérifier que le composant est montée
  useEffect(() => {
    console.log("╔═══════════════════════════════════════════════════════╗");
    console.log("║  [Recommendation] 🎯 COMPONENT MOUNTED - DIAGNOSTIC   ║");
    console.log("╚═══════════════════════════════════════════════════════╝");
    console.log("[Recommendation] ⏰ Timestamp:", new Date().toISOString());
    console.log("[Recommendation] 🔷 Token reçu?:", !!token ? "✅ OUI" : "❌ NON");
    console.log("[Recommendation] 🔷 onProductAdded reçu?:", !!onProductAdded ? "✅ OUI" : "❌ NON");
    console.log("[Recommendation] 🔷 onProductAdded type:", typeof onProductAdded);
    console.log("[Recommendation] 🔷 onProductAdded fonction?:", typeof onProductAdded === 'function' ? "✅ OUI" : "❌ NON");
    
    loadRecommendedProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ✅ ÉTAPE 2: Charger les produits recommandés
  const loadRecommendedProducts = async () => {
    try {
      setLoading(true);
      console.log("[Recommendation] 📡 Récupération produits...");

      const response = await fetch('http://localhost:5000/api/products?limit=6', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Erreur réseau: ' + response.status);

      const data = await response.json();
      console.log("[Recommendation] ✅ Produits chargés:", data.length, "articles");
      console.log("[Recommendation] 📋 Premier produit:", data[0]?.brand, "- Prix:", data[0]?.price);
      
      setRecommendedProducts(data);
      setError(null);

    } catch (err) {
      console.error("[Recommendation] ❌ ERREUR CHARGEMENT:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ÉTAPE 3 & 4 & 5: AJOUTER AU PANIER AVEC TOUS LES FALLBACKS
  const handleAddToCart = (product) => {
    console.log("\n");
    console.log("╔═══════════════════════════════════════════════════════╗");
    console.log("║  [Recommendation] 🛒 BUTTON CLICK - AJOUT AU PANIER   ║");
    console.log("╚═══════════════════════════════════════════════════════╝");
    console.log("[Recommendation] ⏰ Timestamp:", new Date().toISOString());
    console.log("[Recommendation] 📦 Produit ID:", product?.id || "❌ NULL");
    console.log("[Recommendation] 🏷️  Produit Marque:", product?.brand || "❌ UNKNOWN");
    console.log("[Recommendation] 💰 Prix:", product?.price || "❌ NULL");
    console.log("[Recommendation] 📊 Stock:", product?.stock || "❌ NULL");
    
    // ✅ ÉTAPE 3A: Validation du produit
    if (!product || !product.id) {
      console.error("[Recommendation] ❌ ERREUR: Produit INVALIDE/NULL");
      alert('❌ Erreur: Produit invalide');
      return;
    }
    console.log("[Recommendation] ✅ Validation produit OK");

    try {
      // ✅ ÉTAPE 3B: Vérifier les props du parent
      const hasParentFunction = onProductAdded && typeof onProductAdded === 'function';
      console.log("[Recommendation] 🔷 Parent function OK?:", hasParentFunction ? "✅ OUI" : "⚠️  NON");
      
      // ✅ ÉTAPE 4: MÉTHODE 1 - Appeler le parent (s'il existe)
      if (hasParentFunction) {
        console.log("[Recommendation] 🔔 ÉTAPE 4: Appel du parent (onProductAdded)...");
        onProductAdded(product);
        console.log("[Recommendation] ✅ Parent notifié avec succès");
        alert(`✅ ${product.brand} ajouté au panier! (via parent)`);
        
        // ✅ ATTENDRE QUE LE PARENT METTE À JOUR LE STATE, PUIS VÉRIFIER LOCALSTORAGE
        setTimeout(() => {
          const updatedBasket = JSON.parse(localStorage.getItem('basket')) || [];
          console.log("[Recommendation] 🔍 localStorage 'basket' après parent:", updatedBasket.length, "articles");
          console.log("[Recommendation] ✅ Product dans localStorage?:", updatedBasket.some(item => item.id === product.id) ? "✅ OUI" : "⚠️  NON");
        }, 100);
        
        return;
      }

      // ✅ ÉTAPE 5: FALLBACK - Si le parent n'existe pas, fallback direct localStorage
      console.log("[Recommendation] ⚠️  FALLBACK: Parent function n'existe pas");
      console.log("[Recommendation] 💾 ÉTAPE 5: Écriture directe localStorage (fallback)...");
      
      // Récupérer le panier actuel
      const currentBasket = JSON.parse(localStorage.getItem('basket')) || [];
      console.log("[Recommendation] 📖 Panier actuel (avant):", currentBasket.length, "articles");
      
      // Vérifier si le produit existe déjà
      const existingItemIndex = currentBasket.findIndex(item => item.id === product.id);
      console.log("[Recommendation] 🔍 Produit existe déjà?:", existingItemIndex !== -1 ? "✅ OUI" : "❌ NON");
      
      if (existingItemIndex !== -1) {
        // Incrémenter la quantité
        currentBasket[existingItemIndex].quantity = (currentBasket[existingItemIndex].quantity || 1) + 1;
        console.log("[Recommendation] ➕ Quantité +1:", currentBasket[existingItemIndex].quantity);
      } else {
        // Ajouter le produit
        currentBasket.push({
          id: product.id,
          brand: product.brand,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1
        });
        console.log("[Recommendation] ✅ Produit ajouté au tableau");
      }

      // Sauvegarder dans localStorage
      localStorage.setItem('basket', JSON.stringify(currentBasket));
      console.log("[Recommendation] 💾 localStorage 'basket' sauvegardé avec succès");
      console.log("[Recommendation] 📊 Panier total (après):", currentBasket.length, "articles");
      console.log("[Recommendation] ✅ Contenu localStorage:", JSON.stringify(currentBasket.map(item => ({ id: item.id, qty: item.quantity }))));
      
      // ✅ NOTIFICATION UTILISATEUR
      alert(`✅ ${product.brand} ajouté au panier! (via fallback localStorage)`);
      
      // ✅ FORCER LA MISE À JOUR (car Shop.js écoute localStorage)
      console.log("[Recommendation] 🔄 Envoi événement custom pour notifier les autres composants...");
      window.dispatchEvent(new Event('basketUpdated'));
      console.log("[Recommendation] ✅ Event 'basketUpdated' envoyé");
      
    } catch (error) {
      console.error("[Recommendation] ❌ ERREUR CRITIQUE:", error.message);
      console.error("[Recommendation] 📍 Stack trace:", error.stack);
      alert('❌ Erreur: ' + error.message);
    }
  };

  // ✅ RENDU: États de chargement et d'erreur
  if (loading) {
    return (
      <div className="recommendation-container">
        <div className="recommendation-loading">
          <p>⏳ Chargement des produits recommandés...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-container">
        <div className="recommendation-error">
          <p>❌ Erreur de chargement: {error}</p>
          <button onClick={loadRecommendedProducts} style={{ marginTop: '10px' }}>
            ↻ Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!recommendedProducts || recommendedProducts.length === 0) {
    return (
      <div className="recommendation-container">
        <div className="recommendation-empty">
          <p>Aucune recommandation disponible</p>
        </div>
      </div>
    );
  }

  // ✅ RENDU: Grille des produits recommandés
  return (
    <div className="recommendation-container">
      <h2 style={{ marginBottom: '20px', color: '#333' }}>🎯 Produits Recommandés</h2>
      <div className="recommendation-grid">
        {recommendedProducts.map(product => {
          const imageUrl = product.imageUrl
            ? (product.imageUrl.startsWith('/')
              ? `http://localhost:5000${product.imageUrl}`
              : product.imageUrl)
            : `/images/placeholder.png`;

          return (
            <div key={product.id} className="recommendation-card">
              <div className="recommendation-image">
                <img 
                  src={imageUrl}
                  alt={product.brand || 'Produit'}
                  onError={(e) => {
                    console.warn("[Recommendation] Image non trouvée:", product.brand);
                    e.target.src = `/images/placeholder.png`;
                  }}
                />
              </div>
              <div className="recommendation-info">
                <h3>{product.brand || 'Produit'}</h3>
                <p className="recommendation-id">ID: {product.id}</p>
                <p className="recommendation-price">
                  <strong>${(product.price || 0).toFixed(2)}</strong>
                </p>
                
                {/* ✅ BOUTON ADD TO CART - ENTIÈREMENT CLIQUABLE */}
                <button
                  className="recommendation-add-btn"
                  onClick={() => {
                    console.log("[Recommendation] 🖱️  Button clicked pour:", product.brand);
                    handleAddToCart(product);
                  }}
                  type="button"
                  style={{
                    cursor: 'pointer',
                    pointerEvents: 'auto',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    width: '100%',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#5568d3';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#667eea';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🛒 Ajouter au panier
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
