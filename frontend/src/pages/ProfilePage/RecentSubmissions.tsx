const VERDICT_STYLE: Record<string, { bg: string; color: string }> = {
  "accepted":             { bg: "#dcfce7", color: "#16a34a" },
  "wrong answer":         { bg: "#fee2e2", color: "#dc2626" },
  "time limit exceeded":  { bg: "#fef3c7", color: "#d97706" },
  "runtime error":        { bg: "#fee2e2", color: "#dc2626" },
};

interface RecentSubmissionsProps {
  submissions?: any[];
  loading?: boolean;
}

const formatTime = (date: string) => {
  const submissionDate = new Date(date);
  const now = new Date();
  const diff = now.getTime() - submissionDate.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return submissionDate.toLocaleDateString();
};

export default function RecentSubmissions({ submissions = [], loading = false }: RecentSubmissionsProps) {
  if (loading) {
    return (
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-[13px] font-black uppercase tracking-wider text-gray-400 mb-4">Recent Submissions</h3>
        <div className="text-center py-8 text-gray-400">Loading...</div>
      </section>
    );
  }

  if (submissions.length === 0) {
    return (
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-[13px] font-black uppercase tracking-wider text-gray-400 mb-4">Recent Submissions</h3>
        <div className="text-center py-8 text-gray-400">No submissions yet</div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-[13px] font-black uppercase tracking-wider text-gray-400 mb-4">Recent Submissions</h3>
      <div className="flex flex-col gap-2">
        {submissions.map((s) => {
          const statusKey = (s.status || '').toLowerCase();
          const vs = VERDICT_STYLE[statusKey] ?? { bg: "#f4f6f8", color: "#6b7280" };
          
          return (
            <div key={s._id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#f8fafc] transition-colors">
              {/* Verdict dot */}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: vs.color }}
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1A1D2B] truncate">
                  {s.problemId?.title || 'Unknown Problem'}
                </p>
                <p className="text-[11px] text-gray-400">
                  {s.language} · {formatTime(s.createdAt)}
                </p>
              </div>

              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span
                  className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-wide whitespace-nowrap"
                  style={{ backgroundColor: vs.bg, color: vs.color }}
                >
                  {s.status?.toUpperCase() || 'PENDING'}
                </span>
                {s.runtime && (
                  <span className="text-[10px] text-gray-400 font-medium">{s.runtime}ms</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
