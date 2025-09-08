'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function NewTaskPage() {
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create task');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        {}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create New Task</h2>
          <p className="mt-2 text-gray-500 text-sm">
            Organize your work and boost productivity 
          </p>
        </div>
        {}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {}
              <span>{error}</span>
            </div>
          )}
          {}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              maxLength={100}
              className="block w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:outline-none 
              focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition "
              placeholder="e.g. Finish project report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {}
          <div>
            <label
              htmlFor="description"
              className="block text-sm  text-gray-700 mb-1 font-bold"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              maxLength={500}
              className="block w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:outline-none 
              focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition"
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          {}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-bold text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              className="block w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg shadow-sm focus:outline-none 
              focus:ring-2 focus:ring-gray-300 focus:border-gray-300 transition"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
          </div>
          {}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg text-sm font-medium text-center shadow-sm transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
