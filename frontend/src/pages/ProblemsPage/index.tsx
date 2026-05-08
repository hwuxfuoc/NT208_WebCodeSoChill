import { useState, useEffect } from "react";
import { useProblems } from "../../hooks/useProblems";

import CalendarStreak from "./CalendarStreak";
import DailyRandomChallenge from "./DailyRandomChallenge";
import TopicFilterBar from "./TopicFilterBar";
import ProblemSearchBar from "./ProblemSearchBar";
import ProblemTable from "./ProblemTable";
import TodayChallengePanel from "./TodayChallengePanel";
import ProblemsHeader from "./ProblemsHeader";

export type TabType = "all" | "solved" | "unsolved";

const PAGE_SIZE = 20;

export default function ProblemsPage() {
  const [topic, setTopic] = useState("All Topics");
  const [tab, setTab] = useState<TabType>("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search query (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Build server-side filter params
  const tag = topic !== "All Topics" ? topic : undefined;

  const { problems, loading, error, total, totalPages } = useProblems({
    page,
    limit: PAGE_SIZE,
    search: debouncedQuery || undefined,
    tag,
  });

  if (loading && problems.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="page-stack">
      <ProblemsHeader />

      <div className="flex gap-6">
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <TodayChallengePanel />

          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <TopicFilterBar topic={topic} setTopic={setTopic} setPage={setPage} />
            <ProblemSearchBar query={query} setQuery={setQuery} tab={tab} setTab={setTab} setPage={setPage} />
            <ProblemTable rows={problems} page={page} pageCount={totalPages} setPage={setPage} total={total} />
          </section>
        </div>

        <div className="w-[250px] flex flex-col gap-6">
          <CalendarStreak />
          <DailyRandomChallenge />
        </div>
      </div>
    </div>
  );
}

