import { Link } from "react-router-dom";
import { useDailyProblems } from "../../hooks/useDailyProblems";

const DIFF_COLOR: Record<string, { bg: string; text: string }> = {
  easy:   { bg: "#dcfce7", text: "var(--main-green-color)" },
  medium: { bg: "#ffedd5", text: "var(--main-orange-color)" },
  hard:   { bg: "#fee2e2", text: "#dc2626" },
};

export default function DailyRandomChallenge() {
  const { problems, loading } = useDailyProblems();

  const total = 3;
  const solved = 0; // TODO: wire up user solved state
  const pct = Math.round((solved / total) * 100);

  return (
    <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "var(--main-orange-color)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
        <div>
          <h3 className="font-extrabold text-[15px] text-[#1A1D2B] leading-tight">Daily<br/>Challenge</h3>
        </div>
      </div>

      <p className="text-[13px] text-gray-500 leading-relaxed -mt-1">
        Solve 3 problems today (Easy · Medium · Hard) to collect EXP.
      </p>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progress</span>
          <span className="text-[12px] font-bold text-gray-400">{solved}/{total}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: "var(--main-orange-color)" }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="flex items-center justify-center py-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: "var(--main-orange-color)" }}></div>
          </div>
        ) : problems.map((p) => {
          const dc = DIFF_COLOR[p.difficulty] || DIFF_COLOR.easy;
          return (
            <Link
              key={p._id}
              to={`/problems/${p.problemId}`}
              className="flex items-center justify-between rounded-xl px-3 py-2 border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
            >
              <span className="text-[13px] font-semibold text-gray-700 group-hover:text-orange-600 truncate max-w-[130px]">{p.title}</span>
              <span
                className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest flex-shrink-0"
                style={{ backgroundColor: dc.bg, color: dc.text }}
              >
                {p.difficulty}
              </span>
            </Link>
          );
        })}
      </div>

      {problems.length > 0 && (
        <Link
          to={`/problems/${problems[0].problemId}`}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[13px] text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--main-orange-color)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          Start Challenge
        </Link>
      )}
    </section>
  );
}
