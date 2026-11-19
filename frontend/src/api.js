const API_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const productAPI = {
  getAll: (limit = null) => {
    let url = `${API_URL}/products`;
    if (limit && limit > 0) {
      url += `?limit=${limit}`;
    }
    return fetch(url, {
      headers: getAuthHeaders()
    }).then(r => r.json());
  },
  
  getById: (id) => 
    fetch(`${API_URL}/products/${id}`, {
      headers: getAuthHeaders()
    }).then(r => r.json()),
  
  create: (product) => 
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    }).then(r => r.json()),
  
  search: (query) =>
    fetch(`${API_URL}/products/search?query=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders()
    }).then(r => r.json()),
  
  getCategories: (id) => 
    fetch(`${API_URL}/products/${id}/categories`, {
      headers: getAuthHeaders()
    }).then(r => r.json()),
  
  getByCategory: (name) => 
    fetch(`${API_URL}/categories/${name}/products`, {
      headers: getAuthHeaders()
    }).then(r => r.json())
};

export const orderAPI = {
  getById: (id) => 
    fetch(`${API_URL}/orders/${id}`, {
      headers: getAuthHeaders()
    }).then(r => r.json()),
  
  create: (order) => 
    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(order)
    }).then(r => r.json()),
  
  getProducts: (id) => 
    fetch(`${API_URL}/orders/${id}/products`, {
      headers: getAuthHeaders()
    }).then(r => r.json())
};

export const recommendationAPI = {
  getByOrder: (orderId, limit = 5) => 
    fetch(`${API_URL}/recommendations/order/${orderId}?limit=${limit}`, {
      headers: getAuthHeaders()
    }).then(r => r.json()),
  
  getByCategory: (category, limit = 5) => 
    fetch(`${API_URL}/recommendations/category/${category}?limit=${limit}`, {
      headers: getAuthHeaders()
    }).then(r => r.json()),
  
  getByBasket: (productIds, limit = 5) => 
    fetch(`${API_URL}/recommendations/basket?limit=${limit}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productIds })
    }).then(r => r.json()),
  
  getByBasketAdvanced: (basketIds, limit = 5) =>
    fetch(`${API_URL}/recommendations/basket/advanced?limit=${limit}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ basketIds })
    }).then(r => r.json()),
  
  getCoBought: (productId, limit = 5) => 
    fetch(`${API_URL}/recommendations/cobought/${productId}?limit=${limit}`, {
      headers: getAuthHeaders()
    }).then(r => r.json()),
  
  getByProductId: (productId, limit = 4) =>
    fetch(`${API_URL}/recommendations/product/${productId}?limit=${limit}`, {
      headers: getAuthHeaders()
    }).then(r => r.json())
};
