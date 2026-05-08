import { useQuery } from '@tanstack/react-query';
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
  const { data, isPending, error } = useQuery({
    queryKey: ['problem', id],
    queryFn: async () => {
      const response = await getProblem(id!);
      return response.data.problem as ProblemDetail;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  return {
    problem: data || null,
    loading: isPending,
    error: error ? 'Failed to fetch problem details' : null,
  };
};

