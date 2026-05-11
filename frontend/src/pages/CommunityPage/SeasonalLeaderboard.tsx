import { useState, useEffect } from "react";
import { getLeaderboard } from "../../services/profileService";
import { useAuth } from "../../hooks/useAuth";
import FullLeaderboardModal from "./FullLeaderboardModal";

interface Leader {
  _id: string;
  username: string;
  displayname: string;
  avatarUrl: string;
  rank?: string;
  contestRating?: number;
  totalSolved?: number;
}

export default function SeasonalLeaderboard() {
  const [showFull, setShowFull] = useState(false);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await getLeaderboard(1, 4);
      setLeaders(response.data.users || response.data.leaderboard || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load leaderboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPoints = (rating?: number) => {
    if (!rating) return "0";
    return rating.toLocaleString();
  };

  if (loading) {
    return (
      <div className="card flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card flex flex-col p-6 text-center">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={fetchLeaderboard}
          className="mt-2 text-xs px-3 py-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="card flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-lg text-gray-800">Seasonal Leaderboard</h3>
          <span className="px-3 py-1 bg-orange-50 text-orange-500 text-[10px] font-bold rounded-full border border-orange-100">SEASON 4</span>
        </div>
        <p className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase mb-4">Top Performers this month</p>

        <div className="flex flex-col gap-0 flex-1">
          {leaders.map((u, i) => (
            <div key={u._id} className={`flex items-center justify-between py-3 ${i < leaders.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="flex items-center gap-3">
                <span className={`w-5 text-center font-bold text-sm ${i <= 2 ? "text-orange-400" : "text-gray-400"}`}>{i + 1}</span>
                <img src={u.avatarUrl} alt={u.displayname} className="w-9 h-9 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold text-[13px] text-gray-800">{u.displayname}</p>
                  <p className="text-[10px] text-gray-400">@{u.username}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[13px] text-gray-800">{formatPoints(u.contestRating)}</p>
                <p className="text-[8px] text-gray-400 uppercase tracking-wide">Rating Points</p>
              </div>
            </div>
          ))}

          {/* Your rank row — pinned at bottom */}
          {user && (
            <div className="flex items-center justify-between py-3 mt-2 bg-orange-50 rounded-xl px-3 border border-orange-100">
              <div className="flex items-center gap-3">
                <span className="w-5 text-center font-bold text-sm text-orange-500">-</span>
                <div className="w-9 h-9 rounded-xl bg-orange-200 flex items-center justify-center text-[9px] font-black text-orange-600">
                  {user.displayname?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-semibold text-[13px] text-gray-800">{user.displayname}</p>
                  <p className="text-[10px] text-orange-500">@{user.username}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[13px] text-orange-600">{formatPoints(user.contestRating)}</p>
                <p className="text-[8px] text-orange-400 uppercase tracking-wide">Rating Points</p>
              </div>
            </div>
          )}
        </div>

        {/* Full leaderboard button */}
        <button
          onClick={() => setShowFull(true)}
          className="w-full mt-4 py-2.5 rounded-2xl text-sm font-bold transition-colors border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500"
        >
          Full Leaderboard
        </button>
      </div>

      {showFull && <FullLeaderboardModal onClose={() => setShowFull(false)} />}
    </>
  );
}
