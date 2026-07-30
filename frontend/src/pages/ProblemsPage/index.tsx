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

  if (loading && problems.length === 0) return <div className="p-8 text-center text-gray-500 font-semibold">Loading problems...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">Error: {error}</div>;

  return (
    <div className="page-stack">
      <ProblemsHeader />

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="w-full xl:flex-1 flex flex-col gap-6 min-w-0">
          <TodayChallengePanel />

          {/* On screens < 1350px (under xl), render Calendar & Daily Challenge in a responsive 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:hidden w-full">
            <CalendarStreak />
            <DailyRandomChallenge />
          </div>

          <section className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 min-w-0 w-full overflow-hidden">
            <TopicFilterBar topic={topic} setTopic={setTopic} setPage={setPage} />
            <ProblemSearchBar query={query} setQuery={setQuery} tab={tab} setTab={setTab} setPage={setPage} />
            <ProblemTable rows={problems} page={page} pageCount={totalPages} setPage={setPage} total={total} pageSize={PAGE_SIZE} />
          </section>
        </div>

        {/* On screens >= 1350px (xl+), render side widgets in dedicated right column */}
        <div className="hidden xl:flex w-[280px] flex-shrink-0 flex-col gap-6">
          <CalendarStreak />
          <DailyRandomChallenge />
        </div>
      </div>
    </div>
  );
}
