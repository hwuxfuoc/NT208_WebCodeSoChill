import { Contest } from "../../services/contestService";

interface RecentContestsGridProps {
  contests: Contest[];
  onViewRankings: (contest: Contest) => void;
  onViewArchive: () => void;
}

export default function RecentContestsGrid({ contests, onViewRankings, onViewArchive }: RecentContestsGridProps) {
  if (contests.length === 0) return null;

  return (
    <>
      <div className="flex justify-between items-center mt-6 mb-2">
        <p className="text-xs font-bold text-gray-500 tracking-wider uppercase">Recent Contests</p>
        <button
          onClick={onViewArchive}
          className="text-xs font-bold text-gray-500 flex items-center gap-1 transition-colors hover:text-[var(--main-orange-color)]"
        >View Archive <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg></button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {contests.map((c, index) => {
          const startDate = new Date(c.startTime);
          return (
            <div key={c._id} className="card bg-white p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Contest</span>
                  <span className="bg-green-50 text-green-500 px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border border-green-100">FINISHED</span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">{c.title}</h4>
                <p className="text-xs text-gray-400 mb-6">
                  Held on {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {c.participants ? c.participants.length : 0} Participants
                </p>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                <button
                  onClick={() => onViewRankings(c)}
                  className="text-xs font-bold text-orange-500 flex items-center gap-1 hover:underline"
                >Rankings <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
