interface ContestRankingsModalProps {
  onClose: () => void;
  contestName: string;
  contestDate: string;
  totalSolved: string;
}

const MOCK_RANKINGS = [
  { rank: 1, avatar: "https://randomuser.me/api/portraits/men/11.jpg",  name: "alex_rivera",    solved: 4, score: 5780, time: "01:42:18" },
  { rank: 2, avatar: "https://randomuser.me/api/portraits/women/22.jpg", name: "nina_code",      solved: 4, score: 5640, time: "01:48:05" },
  { rank: 3, avatar: "https://randomuser.me/api/portraits/men/33.jpg",  name: "devmaster99",    solved: 4, score: 5400, time: "01:55:30" },
  { rank: 4, avatar: "https://randomuser.me/api/portraits/women/44.jpg", name: "chill_coder",   solved: 3, score: 3900, time: "01:12:44" },
  { rank: 5, avatar: "https://randomuser.me/api/portraits/men/55.jpg",  name: "rustacean_v",   solved: 3, score: 3750, time: "01:20:10" },
  { rank: 6, avatar: "https://randomuser.me/api/portraits/women/66.jpg", name: "lambda_queen",  solved: 3, score: 3600, time: "01:30:59" },
  { rank: 7, avatar: "https://randomuser.me/api/portraits/men/77.jpg",  name: "byte_wizard",   solved: 2, score: 2300, time: "00:58:22" },
  { rank: 8, avatar: "https://randomuser.me/api/portraits/women/88.jpg", name: "zero_to_hero",  solved: 2, score: 2100, time: "01:05:11" },
  { rank: 9, avatar: "https://randomuser.me/api/portraits/men/99.jpg",  name: "type_safety",   solved: 2, score: 1950, time: "01:18:47" },
  { rank: 10, avatar: "https://randomuser.me/api/portraits/women/10.jpg", name: "pipelined",   solved: 1, score: 900,  time: "00:35:02" },
];

const MEDAL: Record<number, { bg: string; color: string; label: string }> = {
  1: { bg: "#fef9c3", color: "#b45309", label: "🥇" },
  2: { bg: "#f1f5f9", color: "#64748b", label: "🥈" },
  3: { bg: "#fff7ed", color: "#c2410c", label: "🥉" },
};

export default function ContestRankingsModal({ onClose, contestName, contestDate, totalSolved }: ContestRankingsModalProps) {
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
          <h2 className="text-xl font-extrabold text-[#1A1D2B] mt-1 leading-tight">{contestName}</h2>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {contestDate}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              {totalSolved} submissions
            </span>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
          <div className="flex flex-col gap-2">
            {MOCK_RANKINGS.map((u) => {
              const medal = MEDAL[u.rank];
              return (
                <div
                  key={u.rank}
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors hover:bg-gray-50"
                  style={medal ? { backgroundColor: medal.bg } : {}}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={medal ? { color: medal.color } : { color: "#9ca3af" }}
                  >
                    {medal ? medal.label : `#${u.rank}`}
                  </span>

                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 flex items-center gap-2 min-w-0 pr-2">
                    <span className="font-bold text-sm text-[#1A1D2B] truncate">{u.name}</span>
                    {u.rank === 1 && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white shadow-sm tracking-wider shrink-0" style={{ backgroundColor: "var(--main-orange-color)" }}>+1000EXP</span>}
                    {u.rank === 2 && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white shadow-sm tracking-wider shrink-0" style={{ backgroundColor: "var(--main-orange-color)" }}>+500EXP</span>}
                    {u.rank === 3 && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md text-white shadow-sm tracking-wider shrink-0" style={{ backgroundColor: "var(--main-orange-color)" }}>+200EXP</span>}
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                    <span className="font-semibold shrink-0 whitespace-nowrap">
                      <span className="font-black text-gray-700">{u.solved}</span>/4 solved
                    </span>
                    <span className="font-semibold tabular-nums text-gray-400 shrink-0 whitespace-nowrap">{u.time}</span>
                    <span
                      className="font-black tabular-nums min-w-[64px] text-right shrink-0 whitespace-nowrap"
                      style={{ color: "var(--main-orange-color)" }}
                    >
                      {u.score.toLocaleString()} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-[10px] text-gray-300 font-semibold tracking-wider uppercase mt-4 pb-2">
            Showing top 10 · Full leaderboard coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
