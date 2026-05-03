export default function RecentContestsGrid() {
  return (
    <>
      <div className="flex justify-between items-center mt-6 mb-2">
        <p className="text-xs font-bold text-gray-500 tracking-wider uppercase">Recent Contests</p>
        <button
          className="text-xs font-bold text-gray-500 flex items-center gap-1 transition-colors"
          style={{} as React.CSSProperties}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--main-orange-color)')}
          onMouseLeave={e => (e.currentTarget.style.color = '')}
        >View Archive <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg></button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {[
          { id: 41, title: "Front-end Performance Architecting", date: "Oct 15", solved: "1,420" },
          { id: 40, title: "Database Sharding & Query Tuning", date: "Oct 10", solved: "980" },
          { id: 39, title: "Cloud-Native Serverless Patterns", date: "Oct 01", solved: "2,105" }
        ].map(c => (
          <div key={c.id} className="card bg-white p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Contest #{c.id}</span>
                <span className="bg-green-50 text-green-500 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border border-green-100">FINISHED</span>
              </div>
              <h4 className="font-bold text-gray-800 text-sm mb-2">{c.title}</h4>
              <p className="text-xs text-gray-400 mb-6">Held on {c.date} • {c.solved} Solved</p>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
              <button className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:underline">Rankings <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></button>
              <button className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors">Editorial</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
