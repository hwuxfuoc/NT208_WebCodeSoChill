import { Link } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Problem {
  id: string | number;
  title: string;
  acceptance: number;
  difficulty: string;
  solved: boolean;
}
interface ProblemTableProps {
  rows: Problem[];
  page: number;
  pageCount: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total?: number;
}

// ─── Difficulty config ────────────────────────────────────────────────────────
// medium → orange (root var); easy → green; hard → red
const DIFF: Record<string, { bg: string; color: string; barColor: string }> = {
  easy:   { bg: "#dcfce7", color: "#16a34a",                        barColor: "#16a34a" },
  medium: { bg: "#ffedd5", color: "var(--main-orange-color)",        barColor: "var(--main-orange-color)" },
  hard:   { bg: "#fee2e2", color: "#dc2626",                        barColor: "#dc2626" },
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const d = difficulty.toLowerCase();
  const s = DIFF[d] ?? DIFF.hard;
  return (
    <span
      className="inline-flex items-center justify-center rounded-md font-black tracking-widest uppercase"
      style={{
        backgroundColor: s.bg,
        color: s.color,
        fontSize: "9px",
        width: "58px",
        padding: "4px 0",
      }}
      data-difficulty={d}
    >
      {difficulty}
    </span>
  );
}

function AcceptanceBar({ value, difficulty }: { value: number; difficulty: string }) {
  const d = difficulty.toLowerCase();
  const s = DIFF[d] ?? DIFF.hard;
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, backgroundColor: s.barColor }}
        />
      </div>
      <span className="text-[13px] text-gray-500">{value}%</span>
    </div>
  );
}

function SolveButton({ id, solved }: { id: string | number; solved: boolean }) {
  return (
    <Link
      to={`/problems/${id}`}
      className="inline-flex items-center justify-center font-bold text-[13px] rounded-xl transition-colors"
      style={{
        minWidth: "88px",
        padding: "6px 18px",
        backgroundColor: solved ? "#f3f4f6" : "var(--main-orange-color)",
        color: solved ? "#6b7280" : "#fff",
        textDecoration: "none",
      }}
      data-solved={solved}
    >
      {solved ? "Solve" : "Solve"}
    </Link>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProblemTable({ rows, page, pageCount, setPage, total }: ProblemTableProps) {
  const totalCount = total ?? rows.length;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-[10px] uppercase tracking-widest">
              <th className="pb-3 font-semibold w-14 text-center">Status</th>
              <th className="pb-3 font-semibold">Title</th>
              <th className="pb-3 font-semibold">Acceptance</th>
              <th className="pb-3 font-semibold">Difficulty</th>
              <th className="pb-3 font-semibold text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                data-problem-id={p.id}
              >
                {/* Status */}
                <td className="py-4 text-center">
                  {p.solved ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto" style={{ color: "var(--main-green-color)" }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  ) : (
                    <span className="w-[18px] h-[18px] rounded-full border-2 border-gray-300 inline-block"></span>
                  )}
                </td>

                {/* Title */}
                <td className="py-4">
                  <span className="font-bold text-[14px] text-[#1A1D2B]">{p.title}</span>
                </td>

                {/* Acceptance with bar */}
                <td className="py-4">
                  <AcceptanceBar value={p.acceptance} difficulty={p.difficulty} />
                </td>

                {/* Difficulty badge */}
                <td className="py-4">
                  <DifficultyBadge difficulty={p.difficulty} />
                </td>

                {/* Action */}
                <td className="py-4 text-right pr-2">
                  <SolveButton id={p.id} solved={p.solved} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: count + pagination */}
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
        <span className="text-[11px] text-gray-400 font-medium">
          Showing {rows.length} of {totalCount} problems
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={page <= 1}
            onClick={() => setPage((v) => v - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f4f6f8] text-gray-500 disabled:opacity-40 hover:bg-gray-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          {Array.from({ length: Math.min(pageCount, 3) }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-colors"
              style={
                page === n
                  ? { backgroundColor: "var(--main-orange-color)", color: "#fff" }
                  : { backgroundColor: "#f4f6f8", color: "#374151" }
              }
            >
              {n}
            </button>
          ))}
          {pageCount > 3 && <span className="text-gray-400 text-sm px-1">...</span>}
          {pageCount > 3 && (
            <button
              onClick={() => setPage(pageCount)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold bg-[#f4f6f8] text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {pageCount}
            </button>
          )}
          <button
            disabled={page >= pageCount}
            onClick={() => setPage((v) => v + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f4f6f8] text-gray-500 disabled:opacity-40 hover:bg-gray-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
