import React, { useEffect, useState } from 'react';
import { getProblems } from '../../services/problemService';

type ProblemItem = {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  difficulty: string;
};

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<ProblemItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProbs = async () => {
      try {
        const res = await getProblems({ page: 1, limit: 100 });
        // API returns { problems, total, page, totalPages }
        setProblems(res.data.problems || []);
      } catch (e) {
        console.error('Failed to fetch problems', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProbs();
  }, []);

  const getDifficultyColor = (diff: string) => {
    const d = diff?.toLowerCase();
    if (d === 'easy') return 'bg-teal-100 text-teal-700 border-teal-200';
    if (d === 'medium') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    if (d === 'hard') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="page-stack">
      <div className="page-header flex justify-between items-end pb-4 border-b border-gray-200/50">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-3xl">📋</span> Problem Management
          </h1>

        </div>
      </div>

      <div className="card overflow-hidden p-0 border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white/80 backdrop-blur-xl rounded-2xl mt-4">
        {loading ? (
          <div className="p-16 text-center text-gray-500 font-medium flex flex-col items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-[#49bb98] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Đang tải danh sách bài tập...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4 rounded-t-2xl">Slug</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4 text-right rounded-t-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {problems.map((p) => {
                  const key = (p._id as any) || (p.id as any) || p.slug;
                  return (
                    <tr key={key} className="hover:bg-[#49bb98]/5 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-gray-500">{p.slug}</td>
                      <td className="px-6 py-4 font-bold text-gray-800">{p.title}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black border uppercase tracking-widest ${getDifficultyColor(p.difficulty)}`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Chỉnh sửa">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {problems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium bg-gray-50/50">
                      Chưa có bài tập nào trên hệ thống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
