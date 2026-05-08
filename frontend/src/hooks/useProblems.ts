import { useQuery } from '@tanstack/react-query';
import { getProblems, GetProblemsParams } from '../services/problemService';
import { ProblemsResponse } from '../types/problem';

export const useProblems = (params: GetProblemsParams = {}) => {
  const { page = 1, limit = 20, search, difficulty, tag } = params;

  const { data, isPending, error } = useQuery({
    queryKey: ['problems', page, limit, search, difficulty, tag],
    queryFn: async () => {
      const response = await getProblems({ page, limit, search, difficulty, tag });
      return response.data as ProblemsResponse;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (prev) => prev, // keep previous data while fetching new page (no flicker)
  });

  return {
    problems: data?.problems || [],
    loading: isPending,
    error: error ? 'Failed to fetch problems' : null,
    total: data?.total || 0,
    totalPages: data?.totalPages || 1,
    page: data?.page || page,
  };
};
