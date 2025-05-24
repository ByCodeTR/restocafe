import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Tables from './pages/tables/Tables';
import Orders from './pages/orders/Orders';
import Kitchen from './pages/kitchen/Kitchen';
import Products from './pages/products/Products';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

// Store
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/tables" element={
              <ProtectedRoute>
                <Tables />
              </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            
            <Route path="/kitchen" element={
              <ProtectedRoute>
                <Kitchen />
              </ProtectedRoute>
            } />
            
            <Route path="/products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App; 