export default function UpcomingContestsTable() {
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
            <tr className="border-t border-gray-200/60">
              <td className="py-5 px-4">
                <p className="font-bold text-gray-800 text-sm mb-1">Spring Microservices Sprint</p>
                <p className="text-xs text-gray-400">Rated for Div. 2 only</p>
              </td>
              <td className="py-5 px-4">
                <p className="font-semibold text-gray-800 text-sm mb-1">Oct 24, 2023</p>
                <p className="text-xs text-gray-400">18:00 UTC</p>
              </td>
              <td className="py-5 px-4 font-semibold text-gray-700 text-sm">2.5 hrs</td>
              <td className="py-5 px-4">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <img className="w-6 h-6 rounded-full border-2 border-gray-100" src="https://randomuser.me/api/portraits/women/44.jpg" alt="user" />
                    <img className="w-6 h-6 rounded-full border-2 border-gray-100" src="https://randomuser.me/api/portraits/men/32.jpg" alt="user" />
                  </div>
                  <span className="text-xs text-orange-500 font-bold ml-2">+842</span>
                </div>
              </td>
              <td className="py-5 px-4 text-right">
                <button
                  className="text-white font-bold py-2 px-6 rounded-full text-xs transition-colors hover:opacity-85"
                  style={{ backgroundColor: "var(--main-orange-color)" }}
                >Register</button>
              </td>
            </tr>
            <tr className="border-t border-gray-200/60">
              <td className="py-5 px-4">
                <p className="font-bold text-gray-800 text-sm mb-1">Rust Memory Safety Duel</p>
                <p className="text-xs text-gray-400">Unrated Global</p>
              </td>
              <td className="py-5 px-4">
                <p className="font-semibold text-gray-800 text-sm mb-1">Oct 26, 2023</p>
                <p className="text-xs text-gray-400">04:00 UTC</p>
              </td>
              <td className="py-5 px-4 font-semibold text-gray-700 text-sm">1.5 hrs</td>
              <td className="py-5 px-4">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <img className="w-6 h-6 rounded-full border-2 border-gray-100" src="https://randomuser.me/api/portraits/men/22.jpg" alt="user" />
                    <img className="w-6 h-6 rounded-full border-2 border-gray-100" src="https://randomuser.me/api/portraits/women/68.jpg" alt="user" />
                  </div>
                  <span className="text-xs text-orange-500 font-bold ml-2">+1.2k</span>
                </div>
              </td>
              <td className="py-5 px-4 text-right">
                <button
                  className="text-white font-bold py-2 px-6 rounded-full text-xs transition-colors hover:opacity-85"
                  style={{ backgroundColor: "var(--main-orange-color)" }}
                >Register</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
