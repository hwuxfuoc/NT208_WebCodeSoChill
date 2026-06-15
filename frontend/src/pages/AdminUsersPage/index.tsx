import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import UserCardModal from '../../components/common/UserCardModal';

type UserItem = {
  _id: string;
  username: string;
  displayname: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatarUrl: string;
  experiencePoints: number;
  level: number;
  rank: number;
  totalSolved: number;
  createdAt: string;
  role: string;
  isLocked?: boolean;
};



function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  danger,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  danger?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[960] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            className="relative bg-white rounded-2xl p-7 w-[380px] shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-[17px] font-extrabold text-[#1A1D2B] mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{message}</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-colors ${danger ? 'bg-red-500 hover:bg-red-600' : 'hover:opacity-90'}`}
                style={!danger ? { backgroundColor: 'var(--main-orange-color)' } : {}}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'experiencePoints' | 'totalSolved' | 'createdAt'>('createdAt');

  const [viewUser, setViewUser] = useState<UserItem | null>(null);
  const [lockTarget, setLockTarget] = useState<UserItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);

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

  useEffect(() => { fetchUsers(1); }, []);

  const handleLock = async () => {
    if (!lockTarget) return;
    try {
      const action = lockTarget.isLocked ? 'unlock' : 'lock';
      await api.put(`/api/admin/users/${lockTarget._id}/${action}`);
      setLockTarget(null);
      fetchUsers(page);
    } catch (e) { console.error(e); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/admin/users/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchUsers(page);
    } catch (e) { console.error(e); }
  };

  const filtered = users
    .filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.displayname.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'experiencePoints') return b.experiencePoints - a.experiencePoints;
      if (sortBy === 'totalSolved') return b.totalSolved - a.totalSolved;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="page-stack">
      <div className="page-header">
        <h1>User Management</h1>
        <span className="text-sm text-gray-400 font-medium">{total} total users</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search by username or display name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 text-gray-700"
        >
          <option value="createdAt">Sort by: Newest</option>
          <option value="experiencePoints">Sort by: Experience</option>
          <option value="totalSolved">Sort by: Problems Solved</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden border border-white/40 shadow-sm bg-white rounded-2xl">
        {loading && users.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin w-6 h-6 border-4 rounded-full" style={{ borderColor: 'var(--main-orange-color)', borderTopColor: 'transparent' }} />
            <span className="text-sm text-gray-400">Loading users...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider font-black">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4 text-center">Experience</th>
                  <th className="px-6 py-4 text-center">Solved</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">No users found.</td></tr>
                ) : filtered.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setViewUser(user)}
                        className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                      >
                        <img
                          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayname || user.username)}`}
                          alt={user.displayname}
                          className="w-9 h-9 rounded-xl object-cover border border-gray-100"
                        />
                        <div>
                          <div className="font-bold text-sm text-[#1A1D2B] flex items-center gap-2">
                            {user.displayname || user.username}
                            {user.role === 'admin' && <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">Admin</span>}
                            {user.isLocked && <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-red-100 text-red-500">Locked</span>}
                          </div>
                          <div className="text-xs text-gray-400">@{user.username}</div>
                        </div>
                      </button>
                    </td>
                    <td className="px-6 py-4 font-bold text-sm" style={{ color: 'var(--main-orange-color)' }}>Lv.{user.level}</td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-600">{user.experiencePoints.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-sm font-bold" style={{ color: 'var(--main-orange-color)' }}>{user.totalSolved}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewUser(user)}
                          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                          title="View Profile"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button
                          onClick={() => setLockTarget(user)}
                          className={`p-2 rounded-lg transition-colors ${user.isLocked ? 'text-green-500 hover:bg-green-50' : 'text-amber-500 hover:bg-amber-50'}`}
                          title={user.isLocked ? 'Unlock User' : 'Lock User'}
                        >
                          {user.isLocked ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteTarget(user)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          <button onClick={() => fetchUsers(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600">← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => fetchUsers(p)} className="w-9 h-9 rounded-xl text-sm font-bold transition-colors"
              style={{ backgroundColor: p === page ? 'var(--main-orange-color)' : 'transparent', color: p === page ? '#fff' : 'var(--text-primary)', border: p !== page ? '1px solid #e5e7eb' : 'none' }}
            >{p}</button>
          ))}
          <button onClick={() => fetchUsers(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600">Next →</button>
        </div>
      )}

      <UserCardModal author={viewUser as any} currentUser={currentUser} onClose={() => setViewUser(null)} />

      <ConfirmModal
        open={!!lockTarget}
        title={lockTarget?.isLocked ? 'Unlock User' : 'Lock User'}
        message={<>Are you sure you want to <strong>{lockTarget?.isLocked ? 'unlock' : 'lock'}</strong> user <strong>@{lockTarget?.username}</strong>?{!lockTarget?.isLocked && ' They will not be able to log in.'}</>}
        confirmLabel={lockTarget?.isLocked ? 'Unlock' : 'Lock'}
        onClose={() => setLockTarget(null)}
        onConfirm={handleLock}
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete User"
        message={<>Are you sure you want to permanently delete <strong>@{deleteTarget?.username}</strong>? This action cannot be undone.</>}
        confirmLabel="Delete"
        danger
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
