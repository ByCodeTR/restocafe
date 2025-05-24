import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { LoginCredentials } from '../types';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const formik = useFormik<LoginCredentials>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values);
        toast.success('Login successful!');
        navigate('/');
      } catch (error: any) {
        toast.error(error.message || 'Login failed');
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              {...formik.getFieldProps('email')}
              className="input"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className="input"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
            )}
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="text-sm text-center">
          <Link
            to="/auth/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Don't have an account? Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 