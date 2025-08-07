import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

export default function UserLoginTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'last_login',
    direction: 'desc'
  });

  // Fetch user login data
  const fetchUserLogins = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8002/api/users/logins');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user logins: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user logins:', err);
      setError('Failed to load user login data. Please try again.');
      // Use mock data if API fails
      setUsers([
        {
          id: 'user1',
          email: 'john@example.com',
          display_name: 'John Doe',
          role: 'user',
          login_count: 15,
          last_login: new Date().toISOString(),
          created_at: '2023-01-15T10:30:00Z'
        },
        {
          id: 'user2',
          email: 'jane@example.com',
          display_name: 'Jane Smith',
          role: 'user',
          login_count: 8,
          last_login: '2023-05-20T14:45:00Z',
          created_at: '2023-02-10T09:15:00Z'
        },
        {
          id: 'admin1',
          email: 'admin@example.com',
          display_name: 'Admin User',
          role: 'admin',
          login_count: 42,
          last_login: '2023-05-22T08:30:00Z',
          created_at: '2022-12-01T11:00:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLogins();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchUserLogins, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate time since last login
  const getTimeSince = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      // Apply search filter
      const searchMatch = 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.display_name && user.display_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Apply role filter
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      
      return searchMatch && roleMatch;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortConfig.key === 'last_login' || sortConfig.key === 'created_at') {
        return sortConfig.direction === 'asc' 
          ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
          : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
      } else if (sortConfig.key === 'login_count') {
        return sortConfig.direction === 'asc' 
          ? a.login_count - b.login_count
          : b.login_count - a.login_count;
      } else {
        return sortConfig.direction === 'asc'
          ? a[sortConfig.key]?.localeCompare(b[sortConfig.key] || '')
          : b[sortConfig.key]?.localeCompare(a[sortConfig.key] || '');
      }
    });

  return (
    <div className="user-login-table">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">User Login Activity</h2>
        <button 
          onClick={fetchUserLogins}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('display_name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>User</span>
                    {sortConfig.key === 'display_name' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('role')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Role</span>
                    {sortConfig.key === 'role' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('login_count')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Login Count</span>
                    {sortConfig.key === 'login_count' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('last_login')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Last Login</span>
                    {sortConfig.key === 'last_login' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('created_at')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Registered</span>
                    {sortConfig.key === 'created_at' && (
                      sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="ml-4">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mt-2"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.display_name ? user.display_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.display_name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.login_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getTimeSince(user.last_login)}</div>
                      <div className="text-xs text-gray-500">{formatDate(user.last_login)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}