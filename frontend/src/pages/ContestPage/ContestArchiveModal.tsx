interface ContestArchiveModalProps {
  onClose: () => void;
  onViewProblems: (name: string, date: string, solved: string) => void;
  onViewRankings: (name: string, date: string, solved: string) => void;
}

const ARCHIVE = [
  { id: 42, title: "Biweekly Architectural Challenge #42", date: "Oct 20, 2023", participants: 3842, solved: 2640 },
  { id: 41, title: "Front-end Performance Architecting",   date: "Oct 15, 2023", participants: 2910, solved: 1420 },
  { id: 40, title: "Database Sharding & Query Tuning",     date: "Oct 10, 2023", participants: 1870, solved: 980  },
  { id: 39, title: "Cloud-Native Serverless Patterns",     date: "Oct 01, 2023", participants: 4210, solved: 2105 },
  { id: 38, title: "Async Rust Systems Challenge",         date: "Sep 22, 2023", participants: 1540, solved: 770  },
  { id: 37, title: "Graph Neural Networks Sprint",         date: "Sep 15, 2023", participants: 2200, solved: 1100 },
  { id: 36, title: "Microservices Security Gauntlet",      date: "Sep 08, 2023", participants: 3100, solved: 1540 },
  { id: 35, title: "Distributed Consensus Algorithms",     date: "Sep 01, 2023", participants: 1980, solved: 860  },
  { id: 34, title: "WebAssembly Performance Challenge",    date: "Aug 25, 2023", participants: 2700, solved: 1350 },
  { id: 33, title: "Zero-copy I/O & Memory Mapping",       date: "Aug 18, 2023", participants: 1420, solved: 680  },
  { id: 32, title: "Functional Programming Patterns",      date: "Aug 11, 2023", participants: 3300, solved: 1650 },
  { id: 31, title: "Kubernetes Scheduling Deep Dive",      date: "Aug 04, 2023", participants: 2050, solved: 990  },
];

export default function ContestArchiveModal({ onClose, onViewProblems, onViewRankings }: ContestArchiveModalProps) {
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
          <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--main-orange-color)" }}>Contest Archive</span>
          <h2 className="text-xl font-extrabold text-[#1A1D2B] mt-1">All Past Contests</h2>
          <p className="text-xs text-gray-400 mt-1">{ARCHIVE.length} contests · Sorted by most recent</p>
        </div>

        <div className="overflow-y-auto flex-1 px-8 py-4" style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}>
          {ARCHIVE.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#f8fafc] border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <span className="text-[10px] font-black text-gray-400 tracking-wider w-10 flex-shrink-0">
                #{c.id}
              </span>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#1A1D2B] truncate">
                  {c.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-gray-400 font-medium">{c.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-[10px] text-gray-400 font-medium">{c.participants.toLocaleString()} participants</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onViewProblems(c.title, c.date, c.solved.toLocaleString())}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-colors"
                >
                  Problems
                </button>
                <button
                  onClick={() => onViewRankings(c.title, c.date, c.solved.toLocaleString())}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-lg text-white hover:opacity-85 transition-opacity"
                  style={{ backgroundColor: "var(--main-orange-color)" }}
                >
                  Rankings
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
