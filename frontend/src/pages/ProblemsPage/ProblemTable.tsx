import { Link } from "react-router-dom";
import type { Problem } from "../../services/problemService";

interface ProblemTableProps {
  rows: Problem[];
  page: number;
  pageCount: number;
  setPage: (p: number) => void;
  total: number;
  pageSize: number;
}

const DIFFICULTY_STYLE: Record<string, { bg: string; color: string }> = {
  easy: { bg: "#dcfce7", color: "#16a34a" },
  medium: { bg: "#fef3c7", color: "#d97706" },
  hard: { bg: "#fee2e2", color: "#dc2626" },
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const d = (difficulty || "easy").toLowerCase();
  const st = DIFFICULTY_STYLE[d] ?? DIFFICULTY_STYLE.easy;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 700,
        backgroundColor: st.bg,
        color: st.color,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {d}
    </span>
  );
}

function AcceptanceBar({ value, difficulty }: { value: number; difficulty: string }) {
  const pct = Math.round(value);
  const d = (difficulty || "easy").toLowerCase();
  const st = DIFFICULTY_STYLE[d] ?? DIFFICULTY_STYLE.easy;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%" }}>
      <div
        style={{
          flex: 1,
          height: "6px",
          borderRadius: "999px",
          backgroundColor: "#f3f4f6",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: st.color,
            borderRadius: "999px",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <span style={{ fontSize: "11px", fontWeight: 700, color: "#6b7280", minWidth: "32px", textAlign: "right" }}>
        {pct}%
      </span>
    </div>
  );
}

function SolveButton({ id, solved, onSolveClick }: { id: string; solved: boolean; onSolveClick: (e: React.MouseEvent) => void }) {
  return (
    <Link
      to={`/problems/${id}`}
      onClick={onSolveClick}
      className={`inline-flex items-center justify-center font-bold text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-1.5 transition-all whitespace-nowrap ${
        solved ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "text-white hover:opacity-90 shadow-sm"
      }`}
      style={!solved ? { backgroundColor: "var(--main-orange-color)" } : {}}
    >
      {solved ? "Solved" : "Solve"}
    </Link>
  );
}

export default function ProblemTable({ rows, page, pageCount, setPage, total, pageSize }: ProblemTableProps) {
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const handleSolveClick = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
  };

  if (rows.length === 0) {
    return (
      <div style={{ padding: "40px 0", textAlign: "center", color: "#9ca3af", fontSize: "14px", fontWeight: 600 }}>
        No problems found matching criteria.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      {/* Header */}
      <div className="flex items-center pb-2.5 mb-2 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        <div className="w-9 shrink-0 text-center">Status</div>
        <div className="flex-1 min-w-0 px-3">Title</div>
        <div className="hidden md:block w-32 shrink-0 px-2">Acceptance</div>
        <div className="hidden sm:block w-20 shrink-0 text-center">Difficulty</div>
        <div className="w-20 sm:w-24 shrink-0 text-right pr-2">Action</div>
      </div>

      {/* Rows */}
      <div className="flex flex-col divide-y divide-gray-100">
        {rows.map((p, idx) => {
          const key = p.slug ?? p._id ?? idx;
          return (
            <div key={key} className="flex items-center py-3.5 hover:bg-gray-50/80 transition-colors rounded-xl px-1 min-w-0">
              {/* Status */}
              <div className="w-9 shrink-0 flex items-center justify-center">
                {p.solved ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--main-green-color)" }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-gray-300 inline-block" />
                )}
              </div>

              {/* Title & Mobile Difficulty tag */}
              <div className="flex-1 min-w-0 px-3 flex flex-col justify-center">
                <span className="font-bold text-xs sm:text-[13.5px] text-[#1A1D2B] truncate block leading-tight">
                  {p.title}
                </span>
                <span className="sm:hidden text-[10px] font-semibold text-gray-400 capitalize mt-0.5">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
                    (p.difficulty || '').toLowerCase() === 'easy' ? 'bg-green-500' :
                    (p.difficulty || '').toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                  }`}></span>
                  {p.difficulty}
                </span>
              </div>

              {/* Acceptance Bar (md+) */}
              <div className="hidden md:block w-32 shrink-0 px-2">
                <AcceptanceBar value={p.acceptance ?? 0} difficulty={p.difficulty} />
              </div>

              {/* Difficulty Badge (sm+) */}
              <div className="hidden sm:flex w-20 shrink-0 justify-center items-center">
                <DifficultyBadge difficulty={p.difficulty} />
              </div>

              {/* Solve Button */}
              <div className="w-20 sm:w-24 shrink-0 flex justify-end items-center pr-1">
                <SolveButton id={p.slug ?? p._id ?? ''} solved={p.solved ?? false} onSolveClick={(e) => handleSolveClick(e, p.slug ?? p._id ?? '')} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-5 pt-4 border-t border-gray-100">
        <span className="text-xs font-semibold text-gray-400 text-center sm:text-left">
          Showing {startItem}-{endItem} of {total} problems
        </span>

        {pageCount > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 transition-colors"
            >
              Prev
            </button>
            <span className="text-xs font-bold text-gray-600 px-2">
              {page} / {pageCount}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= pageCount}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
