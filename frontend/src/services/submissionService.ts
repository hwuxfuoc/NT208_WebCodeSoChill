import api from './api';

export interface SubmissionPayload {
  problemId: string;
  language: string;
  code: string;
  contestId?: string;
}

export const runSubmission = (payload: SubmissionPayload) => {
  return api.post('/api/submissions/run', payload);
};

export const submitSolution = (payload: SubmissionPayload) => {
  return api.post('/api/submissions', payload);
};
