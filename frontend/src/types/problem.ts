export interface Problem {
  _id: string;
  slug?: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  topics: string[];
  acceptance?: number;
  solved?: boolean;
}

export interface ProblemsResponse {
  problems: Problem[];
  total: number;
  page: number;
  totalPages: number;
}
