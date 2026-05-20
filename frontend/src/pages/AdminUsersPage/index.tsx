import React, { useEffect, useState } from 'react';
import api from '../../services/api';

type UserItem = {
  _id: string;
  username: string;
  displayname: string;
  avatarUrl: string;
  experiencePoints: number;
  level: number;
  rank: number;
  totalSolved: number;
  createdAt: string;
  role: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<'experiencePoints' | 'totalSolved' | 'createdAt'>('createdAt');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async (p: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/users?page=${p}&limit=20`);
      setUsers(res.data.users || []);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setPage(p);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.displayname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'experiencePoints') {
      return b.experiencePoints - a.experiencePoints;
    } else if (sortBy === 'totalSolved') {
      return b.totalSolved - a.totalSolved;
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading && users.length === 0) {
    return (
      <div className="page-stack">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin inline-block w-6 h-6 border-4 border-orange-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          👥 User Management
        </h1>
        <p className="text-gray-500">Total users: {total}</p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            placeholder="Search by username or display name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
          style={{ color: 'var(--text-primary)' }}
        >
          <option value="createdAt">Sort by: Newest</option>
          <option value="experiencePoints">Sort by: Experience Points</option>
          <option value="totalSolved">Sort by: Problems Solved</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Level</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Experience</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Rank</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Solved</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No users found
                  </td>
                </tr>
              ) : (
                sortedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayname || user.username)}`}
                          alt={user.displayname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {user.displayname || user.username}
                          </div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                          {user.role === 'admin' && (
                            <div className="text-xs font-bold text-orange-500">👑 Admin</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold" style={{ color: 'var(--main-orange-color)' }}>
                          Lv.{user.level}
                        </span>
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {user.experiencePoints.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">exp</div>
                    </td>

                    {/* Rank */}
                    <td className="px-6 py-4 text-center">
                      <div className="inline-block px-3 py-1 bg-orange-50 rounded-lg">
                        <span className="text-sm font-bold" style={{ color: 'var(--main-orange-color)' }}>
                          #{user.rank}
                        </span>
                      </div>
                    </td>

                    {/* Solved */}
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm font-bold" style={{ color: 'var(--main-orange-color)' }}>
                        {user.totalSolved}
                      </div>
                      <div className="text-xs text-gray-400">problems</div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => fetchUsers(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            ← Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchUsers(p)}
                className={`w-8 h-8 rounded-lg transition-colors text-sm font-medium ${
                  p === page
                    ? 'text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: p === page ? 'var(--main-orange-color)' : 'transparent',
                  color: p === page ? 'white' : 'var(--text-primary)',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchUsers(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
