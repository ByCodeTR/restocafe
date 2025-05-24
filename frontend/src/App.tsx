import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import { useAuth } from './features/auth/hooks/useAuth';

// Lazy loaded components
const LoginPage = lazy(() => import('./features/auth/components/LoginPage'));
const RegisterPage = lazy(() => import('./features/auth/components/RegisterPage'));
const DashboardPage = lazy(() => import('./features/dashboard/components/DashboardPage'));
const TableList = lazy(() => import('./features/tables/components/TableList'));
const TableDetail = lazy(() => import('./features/tables/components/TableDetail'));
const OrderList = lazy(() => import('./features/orders/components/OrderList'));
const OrderDetail = lazy(() => import('./features/orders/components/OrderDetail'));
const ReservationList = lazy(() => import('./features/reservations/components/ReservationList'));
const ReservationDetail = lazy(() => import('./features/reservations/components/ReservationDetail'));
const NotFoundPage = lazy(() => import('./components/NotFoundPage'));

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {!isAuthenticated ? (
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<LoginPage />} />
            </Route>
          ) : (
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tables" element={<TableList />} />
              <Route path="/tables/:id" element={<TableDetail />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<OrderDetail />} />
              <Route path="/reservations" element={<ReservationList />} />
              <Route path="/reservations/:id" element={<ReservationDetail />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          )}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App; 