import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/designSystemPro.css';
import './App.css';
import Login from './components/Login';
import Shop from './components/Shop';
import AdminPage from './pages/AdminPage/AdminPage';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if token exists in localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading session:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('basket');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/shop" 
          element={
            <Shop 
              user={user} 
              token={token} 
              onLogout={handleLogout}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={
            user?.role === 'ADMIN' ? (
              <AdminPage 
                token={token} 
                user={user} 
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/shop" replace />
            )
          } 
        />
        <Route path="/" element={<Navigate to="/shop" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
