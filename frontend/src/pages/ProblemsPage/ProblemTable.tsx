import { Link } from "react-router-dom";
import { Problem } from '../../types/problem';

interface ProblemTableProps {
  rows: Problem[];
  page: number;
  pageCount: number;
  pageSize: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  total?: number;
}

const DIFF: Record<string, { bg: string; color: string; barColor: string }> = {
  easy: { bg: "#dcfce7", color: "var(--main-green-color)", barColor: "var(--main-green-color)" },
  medium: { bg: "#ffedd5", color: "var(--main-orange-color)", barColor: "var(--main-orange-color)" },
  hard: { bg: "#fee2e2", color: "#dc2626", barColor: "#dc2626" },
};


const COL = {
  status: "44px",
  title: "1",
  acceptance: "130px",
  difficulty: "82px",
  action: "110px",
};

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const d = difficulty.toLowerCase();
  const s = DIFF[d] ?? DIFF.hard;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "6px",
        fontWeight: 900,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontSize: "10px",
        width: "52px",
        padding: "3px 0",
        backgroundColor: s.bg,
        color: s.color,
      }}
    >
      {difficulty}
    </span>
  );
}

function AcceptanceBar({ value, difficulty }: { value: number; difficulty: string }) {
  const d = difficulty.toLowerCase();
  const s = DIFF[d] ?? DIFF.hard;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: "52px", height: "6px", backgroundColor: "#f3f4f6", borderRadius: "99px", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ height: "100%", width: `${value}%`, backgroundColor: s.barColor, borderRadius: "99px" }} />
      </div>
      <span style={{ fontSize: "13.5px", color: "#6b7280" }}>{value}%</span>
    </div>
  );
}

function SolveButton({ id, solved }: { id: string; solved: boolean }) {
  return (
    <Link
      to={`/problems/${id}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "14px",
        borderRadius: "12px",
        minWidth: "84px",
        padding: "7px 16px",
        backgroundColor: solved ? "#f3f4f6" : "var(--main-orange-color)",
        color: solved ? "#6b7280" : "#fff",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      {solved ? "Solved" : "Solve"}
    </Link>
  );
}

function Row({ children, isHeader = false }: { children: React.ReactNode; isHeader?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #f3f4f6",
        padding: isHeader ? "0 0 10px 0" : "14px 0",
      }}
      className={!isHeader ? "hover:bg-gray-50/60 transition-colors" : ""}
    >
      {children}
    </div>
  );
}

export default function ProblemTable({ rows, page, pageCount, pageSize, setPage, total }: ProblemTableProps) {
  const totalCount = total ?? rows.length;
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

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
      <Row isHeader>
        <div style={{ width: COL.status, flexShrink: 0, textAlign: "center", fontSize: "10px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginLeft: "3px" }}>
          Status
        </div>
        <div style={{ flex: COL.title, fontSize: "10px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginLeft: "10px" }}>
          Title
        </div>
        <div style={{ width: COL.acceptance, flexShrink: 0, fontSize: "10px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", paddingLeft: "20px" }}>
          Acceptance
        </div>
        <div style={{ width: COL.difficulty, flexShrink: 0, fontSize: "10px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: "7px" }}>
          Difficulty
        </div>
        <div style={{ width: COL.action, flexShrink: 0, fontSize: "10px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right", paddingRight: "20px" }}>
          Action
        </div>
      </Row>

      {rows.map((p, idx) => {
        const key = p.slug ?? p._id ?? idx;
        return (
          <Row key={key}>
            <div style={{ width: COL.status, flexShrink: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
              {p.solved ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--main-green-color)" }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <span style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid #d1d5db", display: "inline-block" }} />
              )}
            </div>
            <div style={{ flex: COL.title, display: "flex", alignItems: "center" }}>
              <span style={{ fontWeight: 700, fontSize: "13.5px", color: "#1A1D2B", lineHeight: 1.4 }}>{p.title}</span>
            </div>
            <div style={{ width: COL.acceptance, flexShrink: 0, display: "flex", alignItems: "center" }}>
              <AcceptanceBar value={p.acceptance ?? 0} difficulty={p.difficulty} />
            </div>
            <div style={{ width: COL.difficulty, flexShrink: 0, display: "flex", alignItems: "center" }}>
              <DifficultyBadge difficulty={p.difficulty} />
            </div>
            <div style={{ width: COL.action, flexShrink: 0, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <SolveButton id={p.slug ?? p._id ?? ''} solved={p.solved ?? false} />
            </div>
          </Row>
        );
      })}

      <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
        <span className="text-[11px] text-gray-400 font-medium">
          Showing {startItem}-{endItem} of {totalCount} problems
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
