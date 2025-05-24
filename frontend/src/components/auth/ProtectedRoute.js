import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuth } from '../../store/slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (location.pathname === '/kitchen' && user?.role !== 'kitchen') {
    return <Navigate to="/" replace />;
  }

  if (location.pathname === '/settings' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 