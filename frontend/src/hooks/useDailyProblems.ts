import { useState, useEffect } from "react";
import { getDailyProblems } from "../services/problemService";
import { checkSolvedProblems } from "../services/submissionService";

export interface DailyProblem {
  _id: string;
  problemId: string;
  title: string;
  slug: string;
  difficulty: "easy" | "medium" | "hard";
}

let problemsCache: DailyProblem[] | null = null;
let cacheDate: string | null = null;

export function useDailyProblems() {
  const [problems, setProblems] = useState<DailyProblem[]>(problemsCache || []);
  const [loading, setLoading] = useState(!problemsCache);
  const [error, setError] = useState<string | null>(null);
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [solvedLoading, setSolvedLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const fetchAndCheckSolved = async (dailyProblems: DailyProblem[]) => {
      if (dailyProblems.length === 0) return;
      setSolvedLoading(true);
      try {
        const ids = dailyProblems.map((p) => p._id);
        const res = await checkSolvedProblems(ids);
        const solvedMap = res.data.solved || {};
        setSolvedIds(new Set(Object.keys(solvedMap).filter((k) => solvedMap[k])));
      } catch {
        // silent
      } finally {
        setSolvedLoading(false);
      }
    };

    if (problemsCache && cacheDate === today) {
      setProblems(problemsCache);
      setLoading(false);
      fetchAndCheckSolved(problemsCache);
      return;
    }

    const fetchProblems = async () => {
      try {
        setLoading(true);
        const res = await getDailyProblems();
        const data: DailyProblem[] = res.data.problems || [];
        problemsCache = data;
        cacheDate = today;
        setProblems(data);
        await fetchAndCheckSolved(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load daily problems");
        setSolvedLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const solvedCount = solvedIds.size;

  return { problems, loading, error, solvedIds, solvedCount, solvedLoading };
}
