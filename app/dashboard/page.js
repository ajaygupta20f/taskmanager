'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, token, logout, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const fetchTasks = async (page = 1, searchTerm = search, status = statusFilter) => {
    if (!token) return;
    try {
      setLoadingTasks(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(status !== 'all' && { status }),
      });
      const response = await fetch(`/api/tasks?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch tasks');
      setTasks(data.tasks);
      setPagination(data.pagination);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTasks(1, search, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    fetchTasks(1, search, status);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchTasks(page, search, statusFilter);
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete task');
      }
      fetchTasks(currentPage, search, statusFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === 'pending' ? 'done' : 'pending';
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: task.title, description: task.description, status: newStatus }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update task');
      }
      fetchTasks(currentPage, search, statusFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-700 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-left">
            Task Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
            <span className="text-gray-700 text-sm sm:text-base font-bold">
              Welcome, <strong>{user?.email}</strong>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition w-full sm:w-auto cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 sm:justify-between items-start sm:items-center">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 w-full sm:w-auto text-black"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 font-semibold transition w-full sm:w-auto cursor-pointer"
            >
              Search
            </button>
          </form>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'done'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  statusFilter === status
                    ? 'bg-blue-500 text-white border-blue-500 cursor-pointer'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 cursor-pointer'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
          <Link
            href="/tasks/new"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 font-semibold transition w-full sm:w-auto text-center cursor-pointer"
          >
            + Create Task
          </Link>
        </div>

        {loadingTasks ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No tasks found. Create your first task!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex justify-between items-start flex-col sm:flex-row gap-2">
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-1 ${
                        task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      task.status === 'done'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-semibold transition cursor-pointer"
                    >
                      {task.status === 'done' ? 'Mark Pending' : 'Mark Done'}
                    </button>
                    <Link
                      href={`/tasks/${task._id}/edit`}
                      className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 font-semibold transition cursor-pointer"
                    >
                      Edit
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 font-semibold transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50 w-full sm:w-auto"
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50 w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
