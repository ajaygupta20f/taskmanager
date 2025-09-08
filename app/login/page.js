'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sign in to Your Account</h2>
          <p className="mt-2 text-sm text-gray-600 font-bold">
            Don’t have an account?{' '}
            <Link
              href="/register"
              className="font-bold text-indigo-600 hover:text-indigo-500 transition cursor-pointer"
            >
              Create one
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          {}
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none 
              focus:ring-2 focus:ring-gray-300 focus:border-gray-300 sm:text-sm text-black"
            />
          </div>
          {}
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 sm:text-sm text-black"
            />
          </div>
          {}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
