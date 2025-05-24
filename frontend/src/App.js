import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import Routes from './routes';
import Layout from './components/Layout';
import Notifications from './components/Notifications';
import socketService from './services/socketService';

// Layout components
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
  const { isAuthenticated, user } = useSelector(state => state.auth);

  // Socket bağlantısını yönet
  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.connect();
      return () => socketService.disconnect();
    }
  }, [isAuthenticated, user]);

  return (
    <Provider store={store}>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Notifications />
      </Router>
    </Provider>
  );
}

export default App; 