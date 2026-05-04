import { useState } from "react";
import FullLeaderboardModal from "./FullLeaderboardModal";

const LEADERS = [
  { rank: 1, name: "Alex Code",  role: "Senior Developer",    pts: "24,500", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { rank: 2, name: "Sarah Zen",  role: "Cloud Architect",     pts: "21,320", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { rank: 3, name: "Jordan B.",  role: "Lead Infrastructure", pts: "18,440", img: "https://randomuser.me/api/portraits/men/22.jpg" },
  { rank: 4, name: "DevGuru",    role: "Open Source Pro",     pts: "16,100", img: "https://randomuser.me/api/portraits/women/68.jpg" },
];

export default function SeasonalLeaderboard() {
  const [showFull, setShowFull] = useState(false);

  return (
    <>
      <div className="card flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-lg text-gray-800">Seasonal Leaderboard</h3>
          <span className="px-3 py-1 bg-orange-50 text-orange-500 text-[10px] font-bold rounded-full border border-orange-100">SEASON 4</span>
        </div>
        <p className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase mb-4">Top Performers this month</p>

        <div className="flex flex-col gap-0 flex-1">
          {LEADERS.map((u, i) => (
            <div key={u.rank} className={`flex items-center justify-between py-3 ${i < LEADERS.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="flex items-center gap-3">
                <span className={`w-5 text-center font-bold text-sm ${u.rank <= 3 ? "text-orange-400" : "text-gray-400"}`}>{u.rank}</span>
                <img src={u.img} alt="avatar" className="w-9 h-9 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold text-[13px] text-gray-800">{u.name}</p>
                  <p className="text-[10px] text-gray-400">{u.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[13px] text-gray-800">{u.pts}</p>
                <p className="text-[8px] text-gray-400 uppercase tracking-wide">EXP Points</p>
              </div>
            </div>
          ))}

          {/* Your rank row — pinned at bottom */}
          <div className="flex items-center justify-between py-3 mt-2 bg-orange-50 rounded-xl px-3 border border-orange-100">
            <div className="flex items-center gap-3">
              <span className="w-5 text-center font-bold text-sm text-orange-500">5</span>
              <div className="w-9 h-9 rounded-xl bg-orange-200 flex items-center justify-center text-[9px] font-black text-orange-600">YOU</div>
              <div>
                <p className="font-semibold text-[13px] text-gray-800">You</p>
                <p className="text-[10px] text-orange-500">Rising Star</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-[13px] text-orange-600">15,420</p>
              <p className="text-[8px] text-orange-400 uppercase tracking-wide">EXP Points</p>
            </div>
          </div>
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
