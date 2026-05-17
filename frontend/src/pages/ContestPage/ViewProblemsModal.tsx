import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Contest, getContestProblems } from "../../services/contestService";

interface ViewProblemsModalProps {
  onClose: () => void;
  contest: Contest;
}

const DIFF_STYLE: Record<string, { bg: string; color: string }> = {
  easy:   { bg: "#dcfce7", color: "#16a34a" },
  medium: { bg: "#ffedd5", color: "var(--main-orange-color)" },
  hard:   { bg: "#fee2e2", color: "#dc2626" },
  secret: { bg: "#dbeafe", color: "#2563eb" },
};

export default function ViewProblemsModal({ onClose, contest }: ViewProblemsModalProps) {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const isUpcoming = contest.status === "upcoming";
  const isPastContest = contest.status === "ended";

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await getContestProblems(contest._id);
        setProblems(res.data.problems);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load problems.");
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [contest._id]);

  const handleProblemClick = (problem: any) => {
    onClose();
    // Chuyển sang trang làm bài kèm contestId
    navigate(`/problems/${problem.slug}?contestId=${contest._id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative flex flex-col"
        style={{ maxHeight: "85vh" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors z-10"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="px-8 pt-8 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--main-orange-color)" }}>Problems</span>
            {isPastContest && (
              <span className="bg-green-50 text-green-500 px-2 py-0.5 rounded text-[9px] font-black tracking-widest border border-green-100">ALL REVEALED</span>
            )}
          </div>
          <h2 className="text-xl font-extrabold text-[#1A1D2B] leading-tight">{contest.title}</h2>
        </div>

        <div className="flex flex-col gap-3 overflow-y-auto px-8 pb-8" style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>
          ) : error ? (
            <div className="text-center text-red-500 py-8 font-semibold">{error}</div>
          ) : problems.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No problems found for this contest.</div>
          ) : (
            problems.map((p, index) => {
              const isLocked = isUpcoming;
              const displayDiff = isLocked ? "secret" : p.difficulty;
              const s = DIFF_STYLE[displayDiff] || DIFF_STYLE.secret;
              return (
                <div
                  key={p._id}
                  onClick={() => isLocked ? undefined : handleProblemClick(p)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-colors group ${
                    isLocked
                      ? "bg-blue-50/60 border border-blue-100 cursor-default select-none"
                      : "bg-[#f8fafc] hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                      isLocked ? "bg-blue-100 text-blue-400" : "bg-white shadow-sm text-gray-400"
                    }`}>
                      {isLocked ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      ) : (index + 1)}
                    </span>
                    <div>
                      <p className={`font-bold text-sm ${
                        isLocked ? "text-blue-300 tracking-[0.2em]" : "text-[#1A1D2B] group-hover:text-orange-500 transition-colors"
                      }`}>
                        {isLocked ? "????" : p.title}
                      </p>
                      <span
                        className="inline-flex mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase"
                        style={{ backgroundColor: s.bg, color: s.color }}
                      >
                        {isLocked ? "secret" : displayDiff}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${
                      isLocked ? "text-blue-300 tracking-widest" : "text-gray-400"
                    }`}>
                      {isLocked ? "??" : "1"} pts
                    </span>
                    {!isLocked && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 group-hover:text-orange-400 transition-colors">
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
