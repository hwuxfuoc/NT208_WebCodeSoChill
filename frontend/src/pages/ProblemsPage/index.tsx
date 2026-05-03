import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { problems, topics } from "../../utils/mockData";

import CalendarStreak from "./CalendarStreak";
import DailyRandomChallenge from "./DailyRandomChallenge";
import TopicFilterBar from "./TopicFilterBar";
import ProblemSearchBar from "./ProblemSearchBar";
import ProblemTable from "./ProblemTable";

export type TabType = "all" | "solved" | "unsolved";

export default function ProblemsPage() {
  const [topic, setTopic] = useState("All Topics");
  const [tab, setTab] = useState<TabType>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const byTopic = problems.filter((p) => topic === "All Topics" || p.topic === topic);
    const byTab = byTopic.filter((p) => (tab === "all" ? true : tab === "solved" ? p.solved : !p.solved));
    const bySearch = byTab.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));
    return bySearch;
  }, [topic, tab, query]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="page-stack">
      <div className="page-header mb-6">
        <h1 className="text-3xl font-extrabold text-[#1A1D2B]">Problems</h1>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 flex flex-col gap-6 min-w-0">
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
