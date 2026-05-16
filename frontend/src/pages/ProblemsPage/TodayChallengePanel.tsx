import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDailyProblems } from "../../hooks/useDailyProblems";

const DIFF_COLOR: Record<string, { bg: string; text: string }> = {
  easy:   { bg: "#dcfce7", text: "var(--main-green-color)" },
  medium: { bg: "#ffedd5", text: "var(--main-orange-color)" },
  hard:   { bg: "#fee2e2", text: "#dc2626" },
};

export default function TodayChallengePanel() {
  const { hash } = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const { problems, loading } = useDailyProblems();

  useEffect(() => {
    if (hash === "#today-challenge" && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [hash]);

  const total = 3;
  const solvedCount = 0; // TODO: wire up user solved state
  const progressPct = Math.round((solvedCount / total) * 100);

  return (
    <div
      id="today-challenge"
      ref={panelRef}
      className="rounded-2xl p-5 text-white relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--main-orange-color), #fabab1ff)" }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/10 rounded-full translate-y-1/3 blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase opacity-80 mb-0.5">Today's Challenge</p>
            <p className="text-sm font-semibold opacity-90">Solve {total} problems · earn EXP</p>
          </div>
          <span className="text-lg font-black tabular-nums">{solvedCount}/{total}</span>
        </div>

        <div className="h-1.5 rounded-full bg-white/30 mb-4 overflow-hidden">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="flex items-center justify-center bg-white/20 rounded-xl px-3 py-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
          ) : problems.length > 0 ? (
            problems.map((p) => {
              const dc = DIFF_COLOR[p.difficulty] || DIFF_COLOR.easy;
              return (
                <Link
                  key={p._id}
                  to={`/problems/${p.problemId}`}
                  className="flex items-center justify-between bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-3 py-2.5 border border-white/20 group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-80 flex-shrink-0">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    <span className="text-sm font-semibold group-hover:underline truncate max-w-[280px]">{p.title}</span>
                  </div>
                  <span
                    className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest flex-shrink-0"
                    style={{ backgroundColor: dc.bg, color: dc.text }}
                  >
                    {p.difficulty}
                  </span>
                </Link>
              );
            })
          ) : (
            <div className="bg-white/20 rounded-xl px-3 py-3 text-sm opacity-70">
              No challenges available today
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
