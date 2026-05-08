import { Link } from "react-router-dom";
import { Problem } from '../../types/problem';

interface ProblemTableProps {
  rows: Problem[];
  page: number;
  pageCount: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total?: number;
}

const DIFF: Record<string, { bg: string; color: string; barColor: string }> = {
  easy: { bg: "#dcfce7", color: "var(--main-green-color)", barColor: "var(--main-green-color)" },
  medium: { bg: "#ffedd5", color: "var(--main-orange-color)", barColor: "var(--main-orange-color)" },
  hard: { bg: "#fee2e2", color: "#dc2626", barColor: "#dc2626" },
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
        width: "50px",
        padding: "2px 0",
        marginBottom: "7px",
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

function SolveButton({ id, solved }: { id: string; solved: boolean }) {
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

export default function ProblemTable({ rows, page, pageCount, setPage, total }: ProblemTableProps) {
  const totalCount = total ?? rows.length;

  // Build smart page numbers: [1, ..., page-1, page, page+1, ..., last]
  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (pageCount <= 7) {
      for (let i = 1; i <= pageCount; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(pageCount - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < pageCount - 2) pages.push('...');
      pages.push(pageCount);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

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
            {rows.map((p, idx) => {
              const key = p.slug ?? p._id ?? idx;
              return (
                <tr
                  key={key}
                  className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                  data-problem-id={p._id}
                >
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

                <td className="py-4">
                  <span className="font-bold text-[14px] text-[#1A1D2B]">{p.title}</span>
                </td>

                <td className="py-4">
                  <AcceptanceBar value={p.acceptance ?? 0} difficulty={p.difficulty} />
                </td>

                <td className="py-4">
                  <DifficultyBadge difficulty={p.difficulty} />
                </td>

                <td className="py-4 text-right pr-2">
                  <SolveButton id={p.slug ?? p._id ?? ''} solved={p.solved ?? false} />
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
          {pageNumbers.map((n, i) =>
            n === '...' ? (
              <span key={`dots-${i}`} className="text-gray-400 text-sm px-1">...</span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n as number)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-bold transition-colors"
                style={
                  page === n
                    ? { backgroundColor: "var(--main-orange-color)", color: "#fff" }
                    : { backgroundColor: "#f4f6f8", color: "#374151" }
                }
              >
                {n}
              </button>
            )
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

