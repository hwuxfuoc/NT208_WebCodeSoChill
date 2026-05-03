export default function DailyRandomChallenge() {
  const solved = 0;
  const total = 5;
  const pct = Math.round((solved / total) * 100);

  return (
    <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
      {/* Icon + Title */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "var(--main-orange-color)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
        <div>
          <h3 className="font-extrabold text-[15px] text-[#1A1D2B] leading-tight">Daily Random<br/>Challenge</h3>
        </div>
      </div>

      <p className="text-[13px] text-gray-500 leading-relaxed -mt-1">
        Solve 5 random problems today to collect EXP.
      </p>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Progress</span>
          <span className="text-[12px] font-bold text-gray-400">{solved}/{total}</span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, backgroundColor: "var(--main-orange-color)" }}
          />
        </div>
      </div>

      {/* Start Random button */}
      <button
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[13px] text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--main-orange-color)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Start Random
      </button>

      {/* Earn EXP button */}
      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[13px] text-gray-500 bg-[#f4f6f8] hover:bg-gray-200 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
        </svg>
        Earn 50 EXP
      </button>
    </section>
  );
}
