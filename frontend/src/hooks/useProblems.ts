import { useState, useEffect } from 'react';
import { getProblems } from '../services/problemService';
import { Problem, ProblemsResponse } from '../types/problem';

export const useProblems = (page: number = 1, limit: number = 20) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await getProblems(page, limit);
        const data: ProblemsResponse = response.data;
        setProblems(data.problems);
        setTotal(data.total);
        setError(null);
      } catch (err) {
        setError('Failed to fetch problems');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, [page, limit]);

  return { problems, loading, error, total };
};
