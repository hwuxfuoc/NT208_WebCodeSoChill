import { useDailyProblems } from "../../hooks/useDailyProblems";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const TODAY_KEY = `daily_exp_earned_${new Date().toISOString().split("T")[0]}`;

export default function DailyRandomChallenge() {
  const { user } = useAuth();
  const { problems, loading, solvedIds, solvedCount, solvedLoading } = useDailyProblems();
  const [earned, setEarned] = useState(() => localStorage.getItem(TODAY_KEY) === "true");
  const navigate = useNavigate();

  const total = problems.length || 3;
  const pct = total > 0 ? Math.round((solvedCount / total) * 100) : 0;
  const allDone = !solvedLoading && solvedCount === total && total > 0;

  useEffect(() => {
    if (allDone && !earned) {
    }
  }, [allDone]);

  const handleClaim = () => {
    localStorage.setItem(TODAY_KEY, "true");
    setEarned(true);
  };

  const handleSolveRandom = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const unsolved = problems.filter(p => !solvedIds.has(p._id));
    if (unsolved.length > 0) {
      const randomProblem = unsolved[Math.floor(Math.random() * unsolved.length)];
      navigate(`/problems/${randomProblem.slug || randomProblem.problemId}`);
    }
  };

  const btnLabel = () => {
    if (earned) return "Earned ✓";
    if (allDone) return "Claim 30 EXP";
    return "Solve Random";
  };

  const btnStyle = (): React.CSSProperties => {
    if (earned) return { backgroundColor: "#e5e7eb", color: "#6b7280", cursor: "default" };
    return { backgroundColor: "var(--main-orange-color)", color: "#fff", cursor: "pointer" };
  };

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
          <h3 className="font-extrabold text-[15px] text-[#1A1D2B] leading-tight whitespace-nowrap">Random Challenge</h3>
        </div>
      </div>

      <p className="text-[13px] text-gray-500 leading-relaxed -mt-1">
        Solve 3 random problems today to collect 30 EXP.
      </p>

      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progress</span>
          <span className="text-[12px] font-bold text-gray-400">
            {solvedLoading ? "..." : `${solvedCount}/${total}`}
          </span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: "var(--main-orange-color)" }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ borderColor: "var(--main-orange-color)" }}></div>
        </div>
      ) : null}

      <button
        onClick={allDone && !earned ? handleClaim : (!allDone ? handleSolveRandom : undefined)}
        disabled={earned}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[13px] transition-all"
        style={btnStyle()}
      >
        {earned && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {allDone && !earned && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )}
        {btnLabel()}
      </button>
    </section>
  );
}
