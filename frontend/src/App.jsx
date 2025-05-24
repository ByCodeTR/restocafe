import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n';
import PrivateRoute from './components/auth/PrivateRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Lazy loaded components
const Login = lazy(() => import('./components/auth/Login'));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const Overview = lazy(() => import('./components/dashboard/Overview'));
const Reports = lazy(() => import('./components/dashboard/Reports'));
const Tables = lazy(() => import('./components/tables/Tables'));
const Orders = lazy(() => import('./components/orders/Orders'));
const Kitchen = lazy(() => import('./components/kitchen/Kitchen'));
const Waiter = lazy(() => import('./components/waiter/Waiter'));
const Reservations = lazy(() => import('./components/reservations/Reservations'));
const Customers = lazy(() => import('./components/customers/Customers'));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="dashboard" element={<Overview />} />
            <Route path="dashboard/reports" element={<Reports />} />
            <Route path="dashboard/tables" element={<Tables />} />
            <Route path="dashboard/orders" element={<Orders />} />
            <Route path="dashboard/kitchen" element={<Kitchen />} />
            <Route path="dashboard/waiter" element={<Waiter />} />
            <Route path="dashboard/reservations" element={<Reservations />} />
            <Route path="dashboard/customers" element={<Customers />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
};

export default App; 