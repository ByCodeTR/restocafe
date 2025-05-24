import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { RegisterData } from '../types';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required'),
  lastName: Yup.string()
    .required('Last name is required'),
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const formik = useFormik<RegisterData>({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await register(values);
        toast.success('Registration successful!');
        navigate('/');
      } catch (error: any) {
        toast.error(error.message || 'Registration failed');
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="firstName" className="label">
            First Name
          </label>
          <div className="mt-1">
            <input
              id="firstName"
              type="text"
              {...formik.getFieldProps('firstName')}
              className="input"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.firstName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="lastName" className="label">
            Last Name
          </label>
          <div className="mt-1">
            <input
              id="lastName"
              type="text"
              {...formik.getFieldProps('lastName')}
              className="input"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="username" className="label">
            Username
          </label>
          <div className="mt-1">
            <input
              id="username"
              type="text"
              {...formik.getFieldProps('username')}
              className="input"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.username}</p>
            )}
          </div>
        </div>

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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>

        <div className="text-sm text-center">
          <Link
            to="/auth/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage; 