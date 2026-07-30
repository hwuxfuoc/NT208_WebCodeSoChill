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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const tag = topic !== "All Topics" ? topic : undefined;
  const solved = tab === "solved" ? true : tab === "unsolved" ? false : undefined;

  const { problems, loading, error, total, totalPages } = useProblems({
    page,
    limit: PAGE_SIZE,
    search: debouncedQuery || undefined,
    tag,
    solved,
  });

  if (loading && problems.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="page-stack">
      <ProblemsHeader />

      <div className="flex flex-col lg:flex-row gap-6 min-w-0">
        <div className="flex-1 flex flex-col gap-4 min-w-0 overflow-x-hidden">
          <TodayChallengePanel />

          <div className="block lg:hidden w-full">
            <CalendarStreak />
          </div>

          <section className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 overflow-x-auto min-w-0">
            <TopicFilterBar topic={topic} setTopic={setTopic} setPage={setPage} />
            <ProblemSearchBar query={query} setQuery={setQuery} tab={tab} setTab={setTab} setPage={setPage} />
            <ProblemTable rows={problems} page={page} pageCount={totalPages} setPage={setPage} total={total} pageSize={PAGE_SIZE} />
          </section>

          <div className="block lg:hidden w-full mt-2">
            <DailyRandomChallenge />
          </div>
        </div>

        <div className="hidden lg:flex w-[240px] flex-shrink-0 flex-col gap-6">
          <CalendarStreak />
          <DailyRandomChallenge />
        </div>
      </div>
    </div>
  );
}

