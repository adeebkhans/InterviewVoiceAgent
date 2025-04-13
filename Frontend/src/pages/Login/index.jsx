import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { login as loginApi } from '../../services/api';
import { loginSuccess } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const { admin, token, success } = data.data;

      if (!success) {
        toast.error('Login failed. Please check your credentials.');
        return;
      }

      // Dispatch the Redux action with both token and user
      dispatch(loginSuccess({ user: admin, token }));

      toast.success('Login successful');
      navigate('/admin/jobs');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed';
      toast.error(errorMessage);
      console.error("Login error:", error);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email" name="email" type="email" required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                disabled={loginMutation.isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password" name="password" type="password" required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                disabled={loginMutation.isLoading}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loginMutation.isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}