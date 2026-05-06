import { useState, useEffect } from 'react';
import { getProblem } from '../services/problemService';

interface ProblemDetail {
  _id: string;
  slug?: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  constraints: string;
  samples: Array<{ input: string; output: string; explanation: string }>;
  tags: string[];
  topics: string[];
  timeLimit: number;
  memoryLimit: number;
}

export const useProblemDetail = (id: string | undefined) => {
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await getProblem(id);
        setProblem(response.data.problem);
        setError(null);
      } catch (err) {
        setError('Failed to fetch problem details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  return { problem, loading, error };
};
