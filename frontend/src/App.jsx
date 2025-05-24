import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Overview from './components/dashboard/Overview';
import Reports from './components/dashboard/Reports';
import Tables from './components/tables/Tables';
import Orders from './components/orders/Orders';
import Kitchen from './components/kitchen/Kitchen';
import Waiter from './components/waiter/Waiter';
import Reservations from './components/reservations/Reservations';
import Customers from './components/customers/Customers';

const App = () => {
  return (
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
  );
};

export default App; 