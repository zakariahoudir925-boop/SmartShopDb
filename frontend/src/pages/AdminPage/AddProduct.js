import React, { useState } from 'react';
import './AddProduct.css';

export default function AddProduct({ token, onProductAdded }) {
  const [formData, setFormData] = useState({
    id: '',
    brand: '',
    price: '',
    category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille
      if (file.size > 5 * 1024 * 1024) {
        setError('❌ Fichier trop volumineux (max 5MB)');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id || !formData.brand || !formData.price || !formData.category) {
      setError('❌ Tous les champs sont requis');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('❌ Le prix doit être positif');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', formData.id.trim());
      formDataToSend.append('brand', formData.brand.trim());
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('category', formData.category.trim());
      
      if (formData.image) {
        console.log('[AddProduct] Image à uploader:', formData.image.name);
        formDataToSend.append('image', formData.image);
      }

      console.log('[AddProduct] ========== Envoi du formulaire ==========');
      console.log('[AddProduct] Produit ID:', formData.id);
      console.log('[AddProduct] Brand:', formData.brand);
      console.log('[AddProduct] Prix:', formData.price);
      console.log('[AddProduct] Catégorie:', formData.category);
      console.log('[AddProduct] Image:', formData.image ? 'OUI ✅' : 'NON ❌');

      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[AddProduct] ❌ Erreur réponse:', errorData);
        throw new Error(errorData.message || 'Erreur lors de l\'ajout');
      }

      const data = await response.json();
      console.log('[AddProduct] ✅ Réponse du backend:');
      console.log('[AddProduct] imageUrl reçue:', data.data?.imageUrl);
      console.log('[AddProduct] URL complète:', `http://localhost:5000${data.data?.imageUrl}`);

      setMessage('✅ Produit ajouté avec succès!');
      setFormData({ id: '', brand: '', price: '', category: '', image: null });
      setImagePreview(null);
      
      // Attendre 2 secondes avant d'appeler le callback
      setTimeout(() => {
        if (onProductAdded) {
          console.log('[AddProduct] Appelant onProductAdded callback');
          onProductAdded();
        }
      }, 1000);

    } catch (err) {
      console.error('[AddProduct] Erreur:', err);
      setError('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="form-wrapper">
        <h2>Ajouter un Nouveau Produit</h2>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-row">
            <div className="form-group">
              <label>ID Produit *</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="PROD_001"
                required
              />
            </div>

            <div className="form-group">
              <label>Marque *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Samsung"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prix *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Catégorie *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Électronique"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Image du Produit</label>
            <div className="image-upload">
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
              />
              <label htmlFor="image" className="upload-label">
                📁 Cliquez ou glissez une image
              </label>
            </div>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Aperçu" />
                <button 
                  type="button" 
                  className="remove-image-btn"
                  onClick={removeImage}
                >
                  ✕ Supprimer
                </button>
              </div>
            )}
          </div>

          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '⏳ Ajout en cours...' : '✅ Ajouter Produit'}
          </button>
        </form>
      </div>
    </div>
  );
}
