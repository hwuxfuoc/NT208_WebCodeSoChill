import { useMemo, useState } from "react";
import { useProblems } from "../../hooks/useProblems";

import CalendarStreak from "./CalendarStreak";
import DailyRandomChallenge from "./DailyRandomChallenge";
import TopicFilterBar from "./TopicFilterBar";
import ProblemSearchBar from "./ProblemSearchBar";
import ProblemTable from "./ProblemTable";
import TodayChallengePanel from "./TodayChallengePanel";
import ProblemsHeader from "./ProblemsHeader";

export type TabType = "all" | "solved" | "unsolved";

export default function ProblemsPage() {
  const [topic, setTopic] = useState("All Topics");
  const [tab, setTab] = useState<TabType>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { problems, loading, error } = useProblems();

  const filtered = useMemo(() => {
    const byTopic = problems.filter((p) => topic === "All Topics" || (p.topics || []).includes(topic));
    const byTab = byTopic.filter((p) => (tab === "all" ? true : tab === "solved" ? p.solved : !p.solved));
    const bySearch = byTab.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
    return bySearch;
  }, [problems, topic, tab, query]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  if (loading) return <div>Loading...</div>;
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
            <ProblemTable rows={rows} page={page} pageCount={pageCount} setPage={setPage} />
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
