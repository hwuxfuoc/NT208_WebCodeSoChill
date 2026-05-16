function Ring({ pct, color, label, solved, total }: { pct: number; color: string; label: string; solved: number; total: number }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <div className="flex flex-col items-center gap-2 mt-4 mb-2">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90 drop-shadow-sm">
          <circle cx="48" cy="48" r={r} fill="none" stroke="#f0f2f5" strokeWidth="8" />
          <circle cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-[#1A1D2B]">{pct}%</span>
      </div>
      <span className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color }}>{label}</span>
      <span className="text-[11px] text-gray-500 font-semibold">{solved.toLocaleString()} <span className="text-gray-300">/</span> {total.toLocaleString()}</span>
    </div>
  );
}

interface SolvedProblemsProps {
  stats?: any;
  solvedByDifficulty?: any[];
  totalProblemsByDifficulty?: any[];
}

export default function SolvedProblems({ stats, solvedByDifficulty = [], totalProblemsByDifficulty = [] }: SolvedProblemsProps) {
  const getTotalCount = (difficulty: string) => {
    const item = totalProblemsByDifficulty.find(d => d._id === difficulty);
    return item ? item.count : 0; 
  };

  const calculatePercentage = (difficulty: string) => {
    const solved = getSolvedCount(difficulty);
    const total = getTotalCount(difficulty);
    return total > 0 ? Math.round((solved / total) * 100) : 0;
  };

  const getSolvedCount = (difficulty: string) => {
    const item = solvedByDifficulty.find(d => d._id === difficulty);
    return item?.count || 0;
  };

  const easyTotal = getTotalCount('easy');
  const mediumTotal = getTotalCount('medium');
  const hardTotal = getTotalCount('hard');

  return (
    <section className="card flex flex-col">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Solved Problems</p>
      <div className="flex justify-around items-center mb-5">
        <Ring 
          pct={calculatePercentage('easy')} 
          color="var(--main-green-color)" 
          label="Easy"   
          solved={getSolvedCount('easy')} 
          total={easyTotal} 
        />
        <Ring 
          pct={calculatePercentage('medium')} 
          color="var(--main-orange-color)"  
          label="Medium" 
          solved={getSolvedCount('medium')} 
          total={mediumTotal} 
        />
        <Ring 
          pct={calculatePercentage('hard')} 
          color="#dc2626"                   
          label="Hard"   
          solved={getSolvedCount('hard')} 
          total={hardTotal} 
        />
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Solved</span>
        <span className="text-xl font-extrabold text-[#1A1D2B]">{stats?.totalSolved || 0}</span>
      </div>
    </section>
  );
}
