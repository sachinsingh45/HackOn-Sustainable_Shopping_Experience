import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import GreenStorePage from './pages/GreenStorePage';
import SellOnAmazonPage from './pages/SellOnAmazonPage';
import GreenBridgePage from './pages/GreenBridgePage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useStore } from './store/useStore';
import MainLayout from './components/layout/MainLayout';
import { ToastProvider } from './context/ToastContext';

function App() {
  const { checkAuth, fetchProducts } = useStore();

  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, [checkAuth, fetchProducts]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Routes with layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="green-store" element={<GreenStorePage />} />
            <Route path="sell" element={<SellOnAmazonPage />} />
            <Route path="greenbridge" element={<GreenBridgePage />} />

            {/* Protected Routes */}
            <Route path="cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;
