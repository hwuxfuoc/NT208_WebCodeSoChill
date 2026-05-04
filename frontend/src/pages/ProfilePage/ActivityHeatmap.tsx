export default function ActivityHeatmap() {
  return (
    <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl text-[#1A1D2B]">Activity</h3>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-lg">Last 3 Months</span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 overflow-x-auto pb-2">
          {Array.from({ length: 98 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-3.5 h-3.5 rounded-[3px] ${
                i % 12 === 0 ? "bg-teal-500" : 
                i % 7 === 0 ? "bg-teal-400" : 
                i % 3 === 0 ? "bg-teal-200" : 
                "bg-gray-100"
              }`} 
            />
          ))}
        </div>
        <div className="flex justify-end items-center gap-2 mt-4 text-[11px] font-bold text-gray-400 uppercase">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-[3px] bg-gray-100"></div>
            <div className="w-3 h-3 rounded-[3px] bg-teal-200"></div>
            <div className="w-3 h-3 rounded-[3px] bg-teal-400"></div>
            <div className="w-3 h-3 rounded-[3px] bg-teal-500"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </section>
  );
}
