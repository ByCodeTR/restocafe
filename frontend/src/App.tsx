import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/hooks/useAuth';
import { authService } from './features/auth/services/authService';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import LoginPage from './features/auth/components/LoginPage';
import RegisterPage from './features/auth/components/RegisterPage';
import DashboardPage from './features/dashboard/components/DashboardPage';
import TableList from './features/tables/components/TableList';
import TableDetail from './features/tables/components/TableDetail';
import TableForm from './features/tables/components/TableForm';
import OrderList from './features/orders/components/OrderList';
import OrderDetail from './features/orders/components/OrderDetail';
import OrderForm from './features/orders/components/OrderForm';
import ReservationList from './features/reservations/components/ReservationList';
import ReservationDetail from './features/reservations/components/ReservationDetail';
import ReservationForm from './features/reservations/components/ReservationForm';
import NotFoundPage from './components/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" />;
};

function App() {
  useEffect(() => {
    authService.initializeAuth();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<ProtectedRoute element={<DashboardPage />} />} />
          
          {/* Table Routes */}
          <Route path="/tables" element={<ProtectedRoute element={<TableList />} />} />
          <Route path="/tables/new" element={<ProtectedRoute element={<TableForm />} />} />
          <Route path="/tables/:id" element={<ProtectedRoute element={<TableDetail />} />} />
          
          {/* Order Routes */}
          <Route path="/orders" element={<ProtectedRoute element={<OrderList />} />} />
          <Route path="/orders/new" element={<ProtectedRoute element={<OrderForm />} />} />
          <Route path="/orders/:id" element={<ProtectedRoute element={<OrderDetail />} />} />

          {/* Reservation Routes */}
          <Route path="/reservations" element={<ProtectedRoute element={<ReservationList />} />} />
          <Route path="/reservations/new" element={<ProtectedRoute element={<ReservationForm />} />} />
          <Route path="/reservations/:id" element={<ProtectedRoute element={<ReservationDetail />} />} />
          <Route path="/reservations/:id/edit" element={<ProtectedRoute element={<ReservationForm />} />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App; 