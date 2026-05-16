// Shared hook so all components fetch the same daily problems from one place
import { useState, useEffect } from "react";
import { getDailyProblems } from "../services/problemService";

export interface DailyProblem {
  _id: string;
  problemId: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
}

let cache: DailyProblem[] | null = null;
let cacheDate: string | null = null;

export function useDailyProblems() {
  const [problems, setProblems] = useState<DailyProblem[]>(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    // Return cached data if same day
    if (cache && cacheDate === today) {
      setProblems(cache);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        setLoading(true);
        const res = await getDailyProblems();
        const data: DailyProblem[] = res.data.problems || [];
        cache = data;
        cacheDate = today;
        setProblems(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load daily problems");
        console.error("Failed to fetch daily problems", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { problems, loading, error };
}
