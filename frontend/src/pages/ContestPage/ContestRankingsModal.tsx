import { useEffect, useState } from "react";
import { Contest, getContestLeaderboard } from "../../services/contestService";
import { useAuth } from "../../hooks/useAuth";
import ModalPortal from "../../components/ModalPortal";

interface ContestRankingsModalProps {
  onClose: () => void;
  contest: Contest;
}

const MEDAL: Record<number, { bg: string; color: string; label: string }> = {
  1: { bg: "#fef9c3", color: "#b45309", label: "🥇" },
  2: { bg: "#f1f5f9", color: "#64748b", label: "🥈" },
  3: { bg: "#fff7ed", color: "#c2410c", label: "🥉" },
};

export default function ContestRankingsModal({ onClose, contest }: ContestRankingsModalProps) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const startDate = new Date(contest.startTime);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await getContestLeaderboard(contest._id);
        setLeaderboard(res.data.leaderboard);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [contest._id]);

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative flex flex-col overflow-hidden"
        style={{ maxHeight: "88vh" }}
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

        <div className="px-8 pt-8 pb-5 flex-shrink-0 border-b border-gray-100">
          <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--main-orange-color)" }}>Rankings</span>
          <h2 className="text-xl font-extrabold text-[#1A1D2B] mt-1 leading-tight">{contest.title}</h2>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div></div>
            ) : error ? (
              <div className="text-center text-red-500 py-8 font-semibold">{error}</div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center text-gray-400 py-8">No submissions yet for this contest.</div>
            ) : (
              leaderboard.map((entry, index) => {
                const rank = index + 1;
                const medal = MEDAL[rank];
                const isCurrentUser = user && user.id === entry.user._id;

                return (
                  <div
                    key={entry.user._id}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors ${isCurrentUser ? "ring-2 ring-orange-200" : "hover:bg-gray-50"}`}
                    style={medal ? { backgroundColor: medal.bg } : {}}
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={medal ? { color: medal.color } : { color: "#9ca3af" }}
                    >
                      {medal ? medal.label : `#${rank}`}
                    </span>

                    <img src={entry.user.avatarUrl || "https://via.placeholder.com/40"} alt={entry.user.displayname} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    <div className="flex-1 flex items-center gap-2 min-w-0 pr-2">
                      <span className="font-bold text-sm text-[#1A1D2B] truncate">{entry.user.displayname}</span>
                      {isCurrentUser && <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold">YOU</span>}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                      <span className="font-semibold shrink-0 whitespace-nowrap">
                        <span className="font-black text-gray-700">{entry.solved}</span> solved
                      </span>
                      <span
                        className="font-black tabular-nums min-w-[40px] text-right shrink-0 whitespace-nowrap"
                        style={{ color: "var(--main-orange-color)" }}
                      >
                        {entry.solved} pts
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
