export default function DailyChallengeCard() {
  return (
    <section className="card challenge-card relative overflow-hidden flex flex-col">
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="font-bold text-xl mb-2">Today's Challenge</h3>
        <p className="text-sm opacity-90 mb-4">Solve 10 Easy Problems to get 100 EXP</p>
        
        <div className="flex justify-between items-end mb-1 text-[11px] font-bold">
          <span></span>
          <span>3/10</span>
        </div>
        <div className="progress-outer mb-6 h-2 bg-orange-300">
          <div className="progress-inner bg-white" style={{ width: "30%" }} />
        </div>
        
        <p className="text-[10px] uppercase font-bold tracking-wider mb-3 opacity-80">UPCOMING PROBLEMS</p>
        
        <div className="flex flex-col gap-2 mb-auto">
          <div className="flex justify-between items-center bg-white/20 p-3 rounded-xl border border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span className="font-medium text-sm">Reverse String Pulse</span>
            </div>
            <span className="bg-teal-500 text-white text-[10px] px-2 py-1 rounded-md font-bold">EASY</span>
          </div>
          <div className="flex justify-between items-center bg-white/20 p-3 rounded-xl border border-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              <span className="font-medium text-sm">Palindrome Check XL</span>
            </div>
            <span className="bg-teal-500 text-white text-[10px] px-2 py-1 rounded-md font-bold">EASY</span>
          </div>
        </div>
        
        <button className="btn-light w-full mt-6 py-3 font-bold text-sm tracking-wide shadow-md">GO TO PROBLEM</button>
      </div>
    </section>
  );
}
