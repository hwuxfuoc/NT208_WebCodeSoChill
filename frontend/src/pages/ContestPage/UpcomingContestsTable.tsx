interface UpcomingContest {
  name: string;
  startDate: string;
  startTime: string;
  duration: string;
  participants: string;
}

interface UpcomingContestsTableProps {
  contests: UpcomingContest[];
  onRegister: (contest: UpcomingContest) => void;
}

export default function UpcomingContestsTable({ contests, onRegister }: UpcomingContestsTableProps) {
  return (
    <>
      <p className="text-xs font-bold text-gray-500 tracking-wider mt-6 mb-2 uppercase">Upcoming Contests</p>

      <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <table className="w-full text-left">
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
            {contests.map((c, i) => (
              <tr key={i} className="border-t border-gray-200/60">
                <td className="py-5 px-4">
                  <p className="font-bold text-gray-800 text-sm mb-1">{c.name}</p>
                </td>
                <td className="py-5 px-4">
                  <p className="font-semibold text-gray-800 text-sm mb-1">{c.startDate}</p>
                  <p className="text-xs text-gray-400">{c.startTime}</p>
                </td>
                <td className="py-5 px-4 font-semibold text-gray-700 text-sm">{c.duration}</td>
                <td className="py-5 px-4">
                  <span className="text-xs text-orange-500 font-bold">{c.participants}</span>
                </td>
                <td className="py-5 px-4 text-right">
                  <button
                    onClick={() => onRegister(c)}
                    className="text-white font-bold py-2 px-6 rounded-full text-xs transition-colors hover:opacity-85"
                    style={{ backgroundColor: "var(--main-orange-color)" }}
                  >Register</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
