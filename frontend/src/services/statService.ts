import api from './api';

export interface DailyProblemsChartItem {
  d: string;
  last: number;
  now: number;
}

export interface ContestStatisticChartItem {
  month: string;
  last: number;
  now: number;
}

export const getDailyProblemsChart = () => {
  return api.get<{ dailyProblems: DailyProblemsChartItem[] }>('/api/stats/daily-problems');
};

export const getContestStats = () => {
  return api.get<{ contestStats: ContestStatisticChartItem[] }>('/api/stats/contest-stats');
};
