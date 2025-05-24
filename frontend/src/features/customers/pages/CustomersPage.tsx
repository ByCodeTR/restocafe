import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerList from '../components/CustomerList';
import CustomerForm from '../components/CustomerForm';
import CustomerDetail from '../components/CustomerDetail';
import CustomerAnalytics from '../components/CustomerAnalytics';

const CustomersPage: React.FC = () => {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<CustomerList />} />
        <Route path="new" element={<CustomerForm />} />
        <Route path=":id" element={<CustomerDetail />} />
        <Route path=":id/edit" element={<CustomerForm />} />
        <Route path="analytics" element={<CustomerAnalytics />} />
      </Routes>
    </div>
  );
};

export default CustomersPage; 