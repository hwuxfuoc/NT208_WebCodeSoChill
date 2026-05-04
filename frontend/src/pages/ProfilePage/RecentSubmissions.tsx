const SUBMISSIONS = [
  { id: 1, problem: "Two Sum Re-imagined", verdict: "Accepted", lang: "Python 3", time: "2 min ago", runtime: "48ms" },
  { id: 2, problem: "Recursive Tree Architecture", verdict: "Wrong Answer", lang: "JavaScript", time: "1h ago", runtime: "—" },
  { id: 3, problem: "Maximum Flow Pulse", verdict: "Accepted", lang: "C++", time: "3h ago", runtime: "12ms" },
  { id: 4, problem: "Valid Anagram Pulse", verdict: "Time Limit Exceeded", lang: "Java", time: "1d ago", runtime: "—" },
  { id: 5, problem: "Longest Palindromic Substring", verdict: "Accepted", lang: "Python 3", time: "2d ago", runtime: "76ms" },
];

const VERDICT_STYLE: Record<string, { bg: string; color: string }> = {
  "Accepted":             { bg: "#dcfce7", color: "#16a34a" },
  "Wrong Answer":         { bg: "#fee2e2", color: "#dc2626" },
  "Time Limit Exceeded":  { bg: "#fef3c7", color: "#d97706" },
  "Runtime Error":        { bg: "#fee2e2", color: "#dc2626" },
};

export default function RecentSubmissions() {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-[13px] font-black uppercase tracking-wider text-gray-400 mb-4">Recent Submissions</h3>
      <div className="flex flex-col gap-2">
        {SUBMISSIONS.map((s) => {
          const vs = VERDICT_STYLE[s.verdict] ?? { bg: "#f4f6f8", color: "#6b7280" };
          return (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#f8fafc] transition-colors">
              {/* Verdict dot */}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: vs.color }}
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1A1D2B] truncate">{s.problem}</p>
                <p className="text-[11px] text-gray-400">{s.lang} · {s.time}</p>
              </div>

              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span
                  className="px-2 py-0.5 rounded-md text-[9px] font-black tracking-wide whitespace-nowrap"
                  style={{ backgroundColor: vs.bg, color: vs.color }}
                >
                  {s.verdict}
                </span>
                {s.runtime !== "—" && (
                  <span className="text-[10px] text-gray-400 font-medium">{s.runtime}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
