import api from './api';

export interface SubmissionPayload {
  problemId: string;
  language: string;
  code: string;
  contestId?: string;
}

export interface LastSubmission {
  _id: string;
  code: string;
  language: string;
  status: string;
  createdAt: string;
}

export const runSubmission = (payload: SubmissionPayload) => {
  return api.post('/api/submissions/run', payload);
};

export const submitSolution = (payload: SubmissionPayload) => {
  return api.post('/api/submissions', payload);
};

export const getLastSubmission = (problemId: string) => {
  return api.get<{ submission: LastSubmission | null }>(`/api/submissions/problem/${problemId}/last`);
};

export const checkSolvedProblems = (problemIds: string[]) => {
  return api.post<{ solved: Record<string, boolean> }>('/api/submissions/check-solved', { problemIds });
};
