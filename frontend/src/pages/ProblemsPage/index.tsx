import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { problems, topics } from "../../utils/mockData";

type TabType = "all" | "solved" | "unsolved";

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

  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="page-stack">
      <h1>Problems</h1>
      <div className="problems-layout">
        <section className="card">
          <div className="chip-row">
            {topics.map((item) => (
              <button key={item} className={`chip ${topic === item ? "active" : ""}`} onClick={() => { setTopic(item); setPage(1); }}>{item}</button>
            ))}
          </div>

          <div className="problem-toolbar">
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search problem..." className="input" />
            <div className="tabs">
              {(["all", "solved", "unsolved"] as TabType[]).map((item) => (
                <button key={item} className={`tab ${tab === item ? "active" : ""}`} onClick={() => { setTab(item); setPage(1); }}>{item}</button>
              ))}
            </div>
          </div>

          <table className="problem-table">
            <thead>
              <tr><th>Status</th><th>Title</th><th>Acceptance</th><th>Difficulty</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.solved ? "?" : "?"}</td>
                  <td>{p.title}</td>
                  <td>{p.acceptance}%</td>
                  <td><span className={`difficulty ${p.difficulty}`}>{p.difficulty}</span></td>
                  <td><Link className="btn-solve" to={`/problems/${p.id}`}>Solve</Link></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage((v) => v - 1)}>Prev</button>
            <span>{page} / {pageCount}</span>
            <button disabled={page >= pageCount} onClick={() => setPage((v) => v + 1)}>Next</button>
          </div>
        </section>

        <aside className="side-stack">
          <div className="card orange">
            <h3>January, 2024</h3>
            <p>Streak 7 days!</p>
            <div className="calendar-grid">
              {Array.from({ length: 28 }).map((_, i) => <span key={i} className={`day ${[3,7,11,14,20].includes(i) ? "active" : ""}`}>{i + 1}</span>)}
            </div>
          </div>
          <div className="card">
            <h3>Daily Random Challenge</h3>
            <p>Solve 5 random problems today to collect EXP.</p>
            <div className="progress-outer"><div className="progress-inner" style={{ width: "0%" }} /></div>
            <button className="btn-primary">Start Random</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
