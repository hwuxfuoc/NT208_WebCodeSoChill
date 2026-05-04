export default function RecentBadges() {
  return (
    <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="mb-6">
        <h3 className="font-bold text-xl text-[#1A1D2B]">Recent Badges</h3>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 bg-[#f4f6f8] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-2 shadow-inner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <h4 className="font-bold text-[#1A1D2B] text-xs mb-0.5">Algorithmic Ace</h4>
          <p className="text-[9px] text-gray-500">Awarded for solving 500 problems</p>
        </div>
        <div className="flex-1 bg-[#f4f6f8] rounded-2xl p-3 flex flex-col items-center justify-center text-center">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-2 shadow-inner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
          <h4 className="font-bold text-[#1A1D2B] text-xs mb-0.5">Speed Demon</h4>
          <p className="text-[9px] text-gray-500">Top 1% runtime in 50 problems</p>
        </div>
      </div>
    </section>
  );
}
