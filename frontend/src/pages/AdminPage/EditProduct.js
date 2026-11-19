import React, { useState, useEffect } from 'react';
import './EditProduct.css';

export default function EditProduct({ token, productId, onProductUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    id: productId,
    brand: '',
    price: '',
    category: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      console.log("[EditProduct] Chargement du produit:", productId);

      const response = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const products = await response.json();
      const product = products.find(p => p.id === productId);

      if (!product) {
        throw new Error('Produit introuvable');
      }

      console.log("[EditProduct] Produit chargé:", product);

      setFormData({
        id: product.id,
        brand: product.brand,
        price: product.price.toString(),
        category: product.category || '',
        image: null
      });

      if (product.imageUrl) {
        const imageUrl = product.imageUrl.startsWith('/')
          ? `http://localhost:5000${product.imageUrl}`
          : product.imageUrl;
        setCurrentImage(imageUrl);
        console.log("[EditProduct] Image actuelle:", imageUrl);
      }

      setError('');
    } catch (err) {
      console.error('[EditProduct] ❌ Erreur chargement:', err.message);
      setError('❌ Impossible de charger le produit');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("[EditProduct] 📁 Image sélectionnée:", file.name);
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("[EditProduct] 👁️ Aperçu créé");
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.brand || !formData.price || !formData.category) {
      setError('Tous les champs sont requis');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Le prix doit être positif');
      return;
    }

    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('id', formData.id);
      formDataToSend.append('brand', formData.brand.trim());
      formDataToSend.append('price', parseFloat(formData.price));
      formDataToSend.append('category', formData.category.trim());

      if (formData.image) {
        console.log("[EditProduct] 📤 Nouvelle image à uploader:", formData.image.name);
        formDataToSend.append('image', formData.image);
      }

      console.log("[EditProduct] Envoi de la mise à jour...");

      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour');
      }

      await response.json();
      console.log("[EditProduct] ✅ Produit mis à jour avec succès");

      setMessage('✅ Produit mis à jour avec succès!');
      
      setTimeout(() => {
        if (onProductUpdated) onProductUpdated();
        if (onCancel) onCancel();
      }, 1500);

    } catch (err) {
      console.error('[EditProduct] ❌ Erreur:', err.message);
      setError('❌ ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-product-overlay">
        <div className="edit-product-modal">
          <div className="loading">⏳ Chargement du produit...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-overlay">
      <div className="edit-product-modal">
        <div className="edit-header">
          <h2>✏️ Modifier le Produit</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-product-form">
          <div className="form-row">
            <div className="form-group">
              <label>ID Produit (non modifiable)</label>
              <input
                type="text"
                value={formData.id}
                disabled
                className="disabled-input"
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
            <label>Changer l'Image (optionnel)</label>
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

            <div className="image-preview-container">
              {imagePreview ? (
                <div className="image-section">
                  <p className="image-label">Nouvelle image:</p>
                  <img src={imagePreview} alt="Aperçu" className="image-preview" />
                </div>
              ) : null}

              {currentImage && !imagePreview ? (
                <div className="image-section">
                  <p className="image-label">Image actuelle:</p>
                  <img src={currentImage} alt="Actuelle" className="image-current" />
                </div>
              ) : null}

              {currentImage && imagePreview ? (
                <>
                  <div className="image-section">
                    <p className="image-label">Avant:</p>
                    <img src={currentImage} alt="Actuelle" className="image-current" />
                  </div>
                  <div className="image-arrow">→</div>
                  <div className="image-section">
                    <p className="image-label">Après:</p>
                    <img src={imagePreview} alt="Aperçu" className="image-preview" />
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onCancel}
              disabled={submitting}
            >
              ❌ Annuler
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={submitting}
            >
              {submitting ? '⏳ Mise à jour...' : '✅ Mettre à Jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
