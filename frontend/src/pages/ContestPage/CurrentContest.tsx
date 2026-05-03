export default function CurrentContest() {
  return (
    <>
      <p className="text-xs font-bold text-orange-600 tracking-wider mt-2 mb-2 uppercase">Current Contests</p>
      
      <section className="card bg-white flex justify-between items-center p-10 border-2 border-white shadow-xl shadow-orange-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full opacity-50 -translate-y-1/2 translate-x-1/4 blur-2xl"></div>
        <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-orange-50 rounded-full opacity-50 translate-y-1/4 blur-2xl"></div>

        <div className="w-[55%] relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-2 bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border border-teal-100">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span> LIVE NOW
            </span>
            <span className="text-xs font-medium text-gray-500">Started at 7:00 PM</span>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">CodeSoChill Biweekly Architectural Challenge #42</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed pr-8">
            A high-performance system design and algorithmic challenge focused on asynchronous scaling patterns and distributed consensus.
          </p>
          
          <div className="flex gap-4">
            <button
              className="bg-white hover:bg-gray-50 text-white font-bold py-2.5 px-6 rounded-full text-sm border border-gray-200 transition-colors shadow-sm"
              style={{ backgroundColor: "var(--main-orange-color)" }}
            >Enter Contest</button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-6 rounded-full text-sm border border-gray-200 transition-colors shadow-sm">View Problems</button>
          </div>
        </div>
        
        <div className="w-[35%] bg-gray-100/50 rounded-3xl p-8 flex flex-col items-center justify-center relative z-10 border border-white/60 shadow-sm backdrop-blur-sm">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">Ends In</span>
          <div className="flex items-end gap-2 text-4xl font-bold text-gray-800 tracking-tight">
            <div className="flex flex-col items-center">
              <span>01</span>
              <span className="text-[8px] text-gray-400 tracking-wide uppercase mt-1">Hours</span>
            </div>
            <span className="text-orange-500 mb-4 leading-none">.</span>
            <div className="flex flex-col items-center">
              <span>42</span>
              <span className="text-[8px] text-gray-400 tracking-wide uppercase mt-1">Mins</span>
            </div>
            <span className="text-orange-500 mb-4 leading-none">.</span>
            <div className="flex flex-col items-center">
              <span>18</span>
              <span className="text-[8px] text-gray-400 tracking-wide uppercase mt-1">Secs</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
