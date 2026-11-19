import React, { useState } from 'react';
import './AdminPanel.css';

export default function AdminPanel({ token, onProductAdded }) {
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
      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.id.trim() || !formData.brand.trim() || !formData.price || !formData.category.trim()) {
      setError('Tous les champs sont requis');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Le prix doit être positif');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      console.log('[AdminPanel] handleSubmit START');
      const formDataToSend = new FormData();
      formDataToSend.append('id', formData.id.trim());
      formDataToSend.append('brand', formData.brand.trim());
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('category', formData.category.trim());
      
      if (formData.image) {
        console.log('[AdminPanel] Image file:', formData.image.name);
        formDataToSend.append('image', formData.image);
      }

      console.log('[AdminPanel] Sending POST request to /api/products');
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('[AdminPanel] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[AdminPanel] ✅ Produit créé avec succès:', data);
      setMessage('✅ Produit ajouté avec succès!');
      setFormData({ id: '', brand: '', price: '', category: '', image: null });
      setImagePreview(null);
      
      if (onProductAdded) {
        console.log('[AdminPanel] Calling onProductAdded callback');
        onProductAdded();
      }

    } catch (err) {
      console.error('[AdminPanel] ❌ Erreur:', err.message);
      setError(`❌ ${err.message || 'Erreur lors de l\'ajout du produit'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  return (
    <div className="admin-panel-wrapper">
      <div className="admin-panel">
        <div className="admin-header">
          <h2>🏪 Ajouter un Produit</h2>
          <p className="admin-subtitle">Complétez le formulaire pour ajouter un nouveau produit avec une image</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id">ID Produit *</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Ex: PROD_001"
                required
                maxLength="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand">Marque *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Ex: Samsung"
                required
                maxLength="100"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Prix ($) *</label>
              <input
                type="number"
                id="price"
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
              <label htmlFor="category">Catégorie *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Ex: Électronique"
                required
                maxLength="50"
              />
            </div>
          </div>

          <div className="form-group form-group-image">
            <label htmlFor="image">📸 Image du Produit</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="file-input"
              />
              <label htmlFor="image" className="file-label">
                <span>📁 Cliquez pour sélectionner une image</span>
                <small>(JPEG, PNG, WebP - Max 5MB)</small>
              </label>
            </div>

            {imagePreview && (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img src={imagePreview} alt="Aperçu du produit" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="remove-image-btn"
                    title="Supprimer l'image"
                  >
                    ✕
                  </button>
                </div>
                <p className="image-preview-text">{formData.image?.name}</p>
              </div>
            )}
          </div>

          {error && <div className="form-error">⚠️ {error}</div>}
          {message && <div className="form-success">✅ {message}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Ajout en cours...
              </>
            ) : (
              <>
                ➕ Ajouter Produit
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
