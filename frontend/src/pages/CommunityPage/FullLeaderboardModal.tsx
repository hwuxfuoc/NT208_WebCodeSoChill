const FULL_BOARD = [
  { rank: 1,  name: "alex_rivera",   role: "Senior Developer",    pts: 24500, avatar: "https://randomuser.me/api/portraits/men/11.jpg" },
  { rank: 2,  name: "nina_code",     role: "Cloud Architect",     pts: 21320, avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
  { rank: 3,  name: "devmaster99",   role: "Lead Infrastructure", pts: 18440, avatar: "https://randomuser.me/api/portraits/men/33.jpg" },
  { rank: 4,  name: "DevGuru",       role: "Open Source Pro",     pts: 16100, avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { rank: 5,  name: "You",           role: "Rising Star",         pts: 15420, avatar: "", isYou: true },
  { rank: 6,  name: "rustacean_v",   role: "Systems Engineer",    pts: 14800, avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
  { rank: 7,  name: "lambda_queen",  role: "FP Advocate",         pts: 12350, avatar: "https://randomuser.me/api/portraits/women/66.jpg" },
  { rank: 8,  name: "byte_wizard",   role: "Fullstack Dev",       pts: 10900, avatar: "https://randomuser.me/api/portraits/men/77.jpg" },
  { rank: 9,  name: "zero_to_hero",  role: "Junior Dev",          pts: 9400,  avatar: "https://randomuser.me/api/portraits/women/88.jpg" },
  { rank: 10, name: "type_safety",   role: "TypeScript Dev",      pts: 7800,  avatar: "https://randomuser.me/api/portraits/men/99.jpg" },
];

const MEDAL: Record<number, { label: string; bg: string; color: string }> = {
  1: { label: "🥇", bg: "#fef9c3", color: "#b45309" },
  2: { label: "🥈", bg: "#f1f5f9", color: "#64748b" },
  3: { label: "🥉", bg: "#fff7ed", color: "#c2410c" },
};

export default function FullLeaderboardModal({ onClose }: { onClose: () => void }) {
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
            {FULL_BOARD.map(u => {
              const medal = MEDAL[u.rank];
              const isYou = (u as any).isYou;
              return (
                <div
                  key={u.rank}
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl"
                  style={isYou ? { backgroundColor: "#fff7ed", border: "1px solid #fed7aa" } : medal ? { backgroundColor: medal.bg } : { backgroundColor: "#f8fafc" }}
                >
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0" style={medal ? { color: medal.color } : { color: "#9ca3af" }}>
                    {medal ? medal.label : `#${u.rank}`}
                  </span>
                  {isYou
                    ? <div className="w-8 h-8 rounded-full bg-orange-200 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-orange-600">YOU</div>
                    : <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#1A1D2B] truncate">{u.name}</p>
                    <p className="text-[10px] text-gray-400">{u.role}</p>
                  </div>
                  <span className="font-black tabular-nums text-sm" style={{ color: isYou ? "var(--main-orange-color)" : "#1A1D2B" }}>
                    {u.pts.toLocaleString()} <span className="text-[9px] font-semibold text-gray-400 uppercase">EXP</span>
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[10px] text-gray-300 font-semibold tracking-wider uppercase mt-4 pb-2">Showing top 10 · Full data via API</p>
        </div>
      </div>
    </div>
  );
}
