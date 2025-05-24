import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { login, register, logout, getCurrentUser } from '../store/authSlice';
import { LoginCredentials, RegisterData, User } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogin = async (credentials: LoginCredentials) => {
    return await dispatch(login(credentials)).unwrap();
  };

  const handleRegister = async (data: RegisterData) => {
    return await dispatch(register(data)).unwrap();
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  const handleGetCurrentUser = async () => {
    return await dispatch(getCurrentUser()).unwrap();
  };

  return {
    user: user as User | null,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getCurrentUser: handleGetCurrentUser,
  };
}; 