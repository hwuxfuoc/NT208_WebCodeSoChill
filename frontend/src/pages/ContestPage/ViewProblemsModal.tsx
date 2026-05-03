import { Link } from "react-router-dom";

interface ViewProblemsModalProps {
  onClose: () => void;
  contestName: string;
}

const CONTEST_PROBLEMS = [
  { id: "two-sum", no: 1, title: "Two Sum Re-imagined", difficulty: "easy", score: 500 },
  { id: "recursive-tree", no: 2, title: "Recursive Tree Architecture", difficulty: "medium", score: 1000 },
  { id: "maximum-flow", no: 3, title: "Maximum Flow Pulse", difficulty: "hard", score: 1500 },
  { id: "sudoku", no: 4, title: "Sudoku Structural Solver", difficulty: "hard", score: 2000 },
];

const DIFF_STYLE: Record<string, { bg: string; color: string }> = {
  easy:   { bg: "#dcfce7", color: "#16a34a" },
  medium: { bg: "#ffedd5", color: "var(--main-orange-color)" },
  hard:   { bg: "#fee2e2", color: "#dc2626" },
};

export default function ViewProblemsModal({ onClose, contestName }: ViewProblemsModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--main-orange-color)" }}>Problems</span>
          <h2 className="text-xl font-extrabold text-[#1A1D2B] mt-1 leading-tight">{contestName}</h2>
        </div>

        <div className="flex flex-col gap-3">
          {CONTEST_PROBLEMS.map((p) => {
            const s = DIFF_STYLE[p.difficulty];
            return (
              <Link
                key={p.id}
                to={`/problems/${p.id}`}
                onClick={onClose}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-black text-gray-400 flex-shrink-0">
                    {p.no}
                  </span>
                  <div>
                    <p className="font-bold text-[#1A1D2B] text-sm group-hover:text-orange-500 transition-colors">{p.title}</p>
                    <span
                      className="inline-flex mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase"
                      style={{ backgroundColor: s.bg, color: s.color }}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">{p.score} pts</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-orange-400 transition-colors">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
