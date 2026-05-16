import { useState, useEffect } from "react";
import { getLeaderboard } from "../../services/profileService";
import { useAuth } from "../../hooks/useAuth";

interface Leader {
  _id: string;
  username: string;
  displayname: string;
  avatarUrl: string;
  rank?: string;
  contestRating?: number;
  totalSolved?: number;
}

const MEDAL: Record<number, { label: string; bg: string; color: string }> = {
  1: { label: "🥇", bg: "#fef9c3", color: "#b45309" },
  2: { label: "🥈", bg: "#f1f5f9", color: "#64748b" },
  3: { label: "🥉", bg: "#fff7ed", color: "#c2410c" },
};

export default function FullLeaderboardModal({ onClose }: { onClose: () => void }) {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await getLeaderboard(1, 20);
      setLeaders(response.data.users || response.data.leaderboard || []);
    } catch (err) {
      console.error("Failed to fetch full leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPoints = (rating?: number) => {
    if (!rating) return "0";
    return rating.toLocaleString();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative flex flex-col"
        style={{ maxHeight: "88vh" }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors z-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="px-8 pt-8 pb-5 flex-shrink-0 border-b border-gray-100">
          <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--main-orange-color)" }}>Seasonal Leaderboard</span>
          <h2 className="text-xl font-extrabold text-[#1A1D2B] mt-1">Top Performers</h2>
          <p className="text-xs text-gray-400 mt-0.5">Season 4 · All-time EXP ranking</p>
        </div>
        <div className="overflow-y-auto flex-1 px-8 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
          <div className="flex flex-col gap-2">
            {loading ? (
              <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div></div>
            ) : leaders.length > 0 ? (
              leaders.map((u, index) => {
                const rank = index + 1;
                const medal = MEDAL[rank];
                const isYou = user && (u._id === user.id || u._id === (user as any)._id);
                return (
                  <div
                    key={u._id}
                    className="flex items-center gap-4 px-4 py-3 rounded-2xl"
                    style={isYou ? { backgroundColor: "#fff7ed", border: "1px solid #fed7aa" } : medal ? { backgroundColor: medal.bg } : { backgroundColor: "#f8fafc" }}
                  >
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0" style={medal ? { color: medal.color } : { color: "#9ca3af" }}>
                      {medal ? medal.label : `#${rank}`}
                    </span>
                    {isYou
                      ? <div className="w-8 h-8 rounded-full bg-orange-200 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-orange-600">YOU</div>
                      : <img src={u.avatarUrl} alt={u.displayname} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-[#1A1D2B] truncate">{u.displayname}</p>
                      <p className="text-[10px] text-gray-400">{u.rank || "Community Member"}</p>
                    </div>
                    <span className="font-black tabular-nums text-sm" style={{ color: isYou ? "var(--main-orange-color)" : "#1A1D2B" }}>
                      {formatPoints(u.contestRating)} <span className="text-[9px] font-semibold text-gray-400 uppercase">EXP</span>
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">No data available.</p>
            )}
          </div>
          <p className="text-center text-[10px] text-gray-300 font-semibold tracking-wider uppercase mt-4 pb-2">Showing top {leaders.length} · Full data via API</p>
        </div>
      </div>
    </div>
  );
}
