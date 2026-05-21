import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProblems } from '../../services/problemService';
import api from '../../services/api';

type ProblemItem = {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  difficulty: string;
  description?: string;
  constraints?: string;
  timeLimit?: number;
  memoryLimit?: number;
  tags?: string[];
  topics?: string[];
  samples?: { input: string; output: string; explanation: string }[];
};

type FormData = {
  slug: string;
  title: string;
  difficulty: string;
  description: string;
  constraints: string;
  timeLimit: string;
  memoryLimit: string;
  tags: string;
  topics: string;
};

const EMPTY_FORM: FormData = {
  slug: '',
  title: '',
  difficulty: 'easy',
  description: '',
  constraints: '',
  timeLimit: '1000',
  memoryLimit: '256',
  tags: '',
  topics: '',
};

const DIFF_STYLE: Record<string, string> = {
  easy: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  hard: 'bg-red-50 text-red-600 border border-red-200',
};

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-gray-50 outline-none focus:border-orange-400 focus:bg-white transition-colors';
const labelCls = 'block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5';

function ProblemFormPanel({
  open,
  editing,
  onClose,
  onSaved,
}: {
  open: boolean;
  editing: ProblemItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editing) {
      setForm({
        slug: editing.slug || '',
        title: editing.title || '',
        difficulty: editing.difficulty || 'easy',
        description: editing.description || '',
        constraints: editing.constraints || '',
        timeLimit: String(editing.timeLimit ?? 1000),
        memoryLimit: String(editing.memoryLimit ?? 256),
        tags: (editing.tags || []).join(', '),
        topics: (editing.topics || []).join(', '),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
  }, [editing, open]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        difficulty: form.difficulty,
        description: form.description.trim(),
        constraints: form.constraints.trim(),
        timeLimit: Number(form.timeLimit),
        memoryLimit: Number(form.memoryLimit),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        topics: form.topics.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editing) {
        const id = (editing._id as any) || (editing.id as any);
        await api.put(`/api/admin/problems/${id}`, payload);
      } else {
        await api.post('/api/admin/problems', payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[900]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-[520px] bg-white shadow-2xl z-[901] flex flex-col"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                  {editing ? 'Edit Problem' : 'New Problem'}
                </p>
                <h2 className="text-xl font-black text-[#1A1D2B]">
                  {editing ? editing.title : 'Create Problem'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Slug</label>
                  <input name="slug" value={form.slug} onChange={handle} className={inputCls} placeholder="two-sum" required />
                </div>
                <div>
                  <label className={labelCls}>Difficulty</label>
                  <select name="difficulty" value={form.difficulty} onChange={handle} className={inputCls}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Title</label>
                <input name="title" value={form.title} onChange={handle} className={inputCls} placeholder="Two Sum" required />
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handle}
                  className={`${inputCls} resize-none`}
                  rows={6}
                  placeholder="Problem description (HTML supported)..."
                />
              </div>

              <div>
                <label className={labelCls}>Constraints</label>
                <textarea
                  name="constraints"
                  value={form.constraints}
                  onChange={handle}
                  className={`${inputCls} resize-none`}
                  rows={3}
                  placeholder="e.g. 2 ≤ nums.length ≤ 10⁴"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Time Limit (ms)</label>
                  <input type="number" name="timeLimit" value={form.timeLimit} onChange={handle} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Memory Limit (MB)</label>
                  <input type="number" name="memoryLimit" value={form.memoryLimit} onChange={handle} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Tags (comma separated)</label>
                <input name="tags" value={form.tags} onChange={handle} className={inputCls} placeholder="array, hash-table" />
              </div>

              <div>
                <label className={labelCls}>Topics (comma separated)</label>
                <input name="topics" value={form.topics} onChange={handle} className={inputCls} placeholder="Array, Hash Table" />
              </div>
            </form>

            <div className="px-7 py-5 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit as any}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60"
                style={{ backgroundColor: 'var(--main-orange-color)' }}
              >
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Problem'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function DeleteConfirmModal({
  problem,
  onClose,
  onConfirm,
}: {
  problem: ProblemItem | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return createPortal(
    <AnimatePresence>
      {problem && (
        <motion.div
          className="fixed inset-0 z-[950] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            className="relative bg-white rounded-2xl p-7 w-[400px] shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </div>
            <h3 className="text-[17px] font-extrabold text-[#1A1D2B] mb-2">Delete Problem</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Are you sure you want to delete <span className="font-bold text-gray-700">"{problem?.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors">
                Cancel
              </button>
              <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<ProblemItem | null>(null);
  const [deleting, setDeleting] = useState<ProblemItem | null>(null);
  const [search, setSearch] = useState('');

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await getProblems({ page: 1, limit: 200 });
      setProblems(res.data.problems || []);
    } catch (e) {
      console.error('Failed to fetch problems', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProblems(); }, []);

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      const id = (deleting._id as any) || (deleting.id as any);
      await api.delete(`/api/admin/problems/${id}`);
      setDeleting(null);
      fetchProblems();
    } catch (e) {
      console.error('Delete failed', e);
    }
  };

  const filtered = problems.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-stack">
      <div className="page-header">
        <h1>Problem Management</h1>
        <button
          onClick={() => { setEditing(null); setPanelOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-md"
          style={{ backgroundColor: 'var(--main-orange-color)', boxShadow: '0 4px 12px rgba(252,107,87,0.35)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Problem
        </button>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm mb-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          type="text"
          placeholder="Search by title or slug..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 outline-none text-sm bg-transparent text-gray-700"
        />
      </div>

      <div className="card overflow-hidden p-0 border border-white/40 shadow-sm bg-white rounded-2xl">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="animate-spin w-6 h-6 border-4 rounded-full border-t-transparent" style={{ borderColor: 'var(--main-orange-color)', borderTopColor: 'transparent' }} />
            <span className="text-sm text-gray-400">Loading problems...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] uppercase tracking-wider font-black">
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const key = (p._id as any) || (p.id as any) || p.slug;
                  return (
                    <tr key={key} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">{p.slug}</td>
                      <td className="px-6 py-4 font-bold text-[#1A1D2B] text-sm">{p.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${DIFF_STYLE[p.difficulty?.toLowerCase()] || DIFF_STYLE.easy}`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setEditing(p); setPanelOpen(true); }}
                            className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => setDeleting(p)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                      No problems found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProblemFormPanel
        open={panelOpen}
        editing={editing}
        onClose={() => { setPanelOpen(false); setEditing(null); }}
        onSaved={fetchProblems}
      />

      <DeleteConfirmModal
        problem={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
