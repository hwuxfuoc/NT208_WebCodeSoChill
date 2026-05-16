import { Link } from "react-router-dom";
import { useDailyProblems } from "../../hooks/useDailyProblems";

const DIFF_COLOR: Record<string, string> = {
  easy:   "bg-teal-500",
  medium: "bg-yellow-500",
  hard:   "bg-red-500",
};

export default function DailyChallengeCard() {
  const { problems, loading } = useDailyProblems();

  return (
    <section className="card challenge-card relative overflow-hidden flex flex-col">
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="font-bold text-xl mb-2">Today's Challenge</h3>
        <p className="text-sm opacity-90 mb-4">Solve today's 3 problems to earn XP</p>

        <div className="flex justify-between items-end mb-1 text-[11px] font-bold">
          <span></span>
          <span>0/3</span>
        </div>
        <div className="progress-outer mb-6 h-2 bg-orange-300">
          <div className="progress-inner bg-white" style={{ width: "0%" }} />
        </div>

        <p className="text-[10px] uppercase font-bold tracking-wider mb-3 opacity-80">TODAY'S PROBLEMS</p>

        <div className="flex flex-col gap-2 mb-auto">
          {loading ? (
            <div className="flex justify-between items-center bg-white/20 p-3 rounded-xl border border-white/20">
              <span className="text-sm">Loading...</span>
            </div>
          ) : problems.length > 0 ? (
            problems.map((p) => (
              <Link
                key={p._id}
                to={`/problems/${p.problemId}`}
                className="flex justify-between items-center bg-white/20 hover:bg-white/30 transition-colors p-3 rounded-xl border border-white/20 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <span className="font-medium text-sm">{p.title}</span>
                </div>
                <span className={`${DIFF_COLOR[p.difficulty]} text-white text-[10px] px-2 py-1 rounded-md font-bold uppercase flex-shrink-0`}>
                  {p.difficulty}
                </span>
              </Link>
            ))
          ) : (
            <div className="flex justify-between items-center bg-white/20 p-3 rounded-xl border border-white/20">
              <span className="text-sm opacity-70">No challenges today</span>
            </div>
          )}
        </div>

        {problems.length > 0 && (
          <Link
            to={`/problems/${problems[0].problemId}`}
            className="btn-light w-full mt-6 py-3 font-bold text-sm tracking-wide shadow-md text-center block"
          >
            START CHALLENGES
          </Link>
        )}
      </div>
    </section>
  );
}
