import { Contest } from "../../services/contestService";

interface UpcomingContestsTableProps {
  contests: Contest[];
  onRegister: (contest: Contest) => void;
}

export default function UpcomingContestsTable({ contests, onRegister }: UpcomingContestsTableProps) {
  if (contests.length === 0) return null;

  return (
    <>
      <p className="text-xs font-bold text-gray-500 tracking-wider mt-6 mb-2 uppercase">Upcoming Contests</p>

      <section className="bg-white rounded-3xl shadow-sm border border-gray-100">
        {/* Desktop table — hidden on small screens */}
        <div className="hidden sm:block overflow-x-auto p-6">
          <table className="w-full text-left" style={{ minWidth: "540px" }}>
            <thead>
              <tr>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase pb-4 px-4 w-2/5">Contest Name</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase pb-4 px-4">Start Time</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase pb-4 px-4">Duration</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase pb-4 px-4">Participants</th>
                <th className="text-[10px] font-bold text-gray-400 tracking-wider uppercase pb-4 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {contests.map((c) => {
                const startDate = new Date(c.startTime);
                return (
                  <tr key={c._id} className="border-t border-gray-200/60">
                    <td className="py-5 px-4">
                      <p className="font-bold text-gray-800 text-sm mb-1">{c.title}</p>
                    </td>
                    <td className="py-5 px-4">
                      <p className="font-semibold text-gray-800 text-sm mb-1">
                        {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="py-5 px-4 font-semibold text-gray-700 text-sm">{c.duration / 60} hrs</td>
                    <td className="py-5 px-4">
                      <span className="text-xs text-orange-500 font-bold">
                        {c.participants ? c.participants.length : 0}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-right">
                      <button
                        onClick={() => onRegister(c)}
                        className="text-white font-bold py-2 px-6 rounded-full text-xs transition-colors hover:opacity-85"
                        style={{ backgroundColor: "var(--main-orange-color)" }}
                      >Register</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile card layout — visible only on small screens */}
        <div className="sm:hidden flex flex-col gap-3 p-4">
          {contests.map((c) => {
            const startDate = new Date(c.startTime);
            return (
              <div key={c._id} className="rounded-2xl border border-gray-100 bg-[#fafbfc] p-4 flex flex-col gap-3">
                <p className="font-bold text-gray-800 text-sm">{c.title}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' '}
                    {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="font-semibold">{c.duration / 60} hrs</span>
                  <span className="text-orange-500 font-bold">{c.participants ? c.participants.length : 0} joined</span>
                </div>
                <button
                  onClick={() => onRegister(c)}
                  className="w-full text-white font-bold py-2.5 rounded-xl text-xs transition-colors hover:opacity-85"
                  style={{ backgroundColor: "var(--main-orange-color)" }}
                >Register</button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
