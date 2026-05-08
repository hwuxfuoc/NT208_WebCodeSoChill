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

  if (loading) return <div>Loading...</div>;
  return (
    <div className="page-stack">
      <h1 className="text-2xl font-bold mb-4">Admin: Problems</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Slug</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((p) => {
            const key = (p._id as any) || (p.id as any) || p.slug;
            return (
              <tr key={key}>
                <td className="border px-4 py-2">{p.slug}</td>
                <td className="border px-4 py-2">{p.title}</td>
                <td className="border px-4 py-2">{p.difficulty}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
