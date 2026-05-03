import React, { useState } from "react";
import ContestRegisterModal from "./ContestRegisterModal";
import ViewProblemsModal from "./ViewProblemsModal";

export default function ContestPage() {
  const [activeModal, setActiveModal] = useState<"register" | "view_problems" | null>(null);
  const [selectedContest, setSelectedContest] = useState("");

  return (
    <div className="page-stack">
      <div className="page-header">
        <h1>Contest</h1>
        <div className="search-bar-container">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--main-orange-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" placeholder="Search contest..." />
        </div>
      </div>

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
              onClick={() => {
                setSelectedContest("CodeSoChill Biweekly Architectural Challenge #42");
                setActiveModal("register");
              }}
              className="text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors shadow-lg hover:opacity-85"
              style={{ backgroundColor: "var(--main-orange-color)" }}
            >Enter Contest</button>
            <button 
              onClick={() => {
                setSelectedContest("CodeSoChill Biweekly Architectural Challenge #42");
                setActiveModal("view_problems");
              }}
              className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-6 rounded-full text-sm border border-gray-200 transition-colors shadow-sm"
            >View Problems</button>
          </div>
        </div>

        <div className="w-[35%] bg-gray-100/50 rounded-3xl p-8 flex flex-col items-center justify-center relative z-10 border border-white/60 shadow-sm backdrop-blur-sm">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">Ends In</span>
          <div className="flex flex-col items-center gap-1">
            {/* Numbers + separators */}
            <div className="flex items-center gap-2 text-4xl font-bold text-gray-800 tracking-tight">
              <span>01</span>
              <span className="text-orange-500 leading-none">:</span>
              <span>42</span>
              <span className="text-orange-500 leading-none">:</span>
              <span>18</span>
            </div>
            {/* Labels aligned under each number */}
            <div className="flex items-center text-[8px] text-gray-400 tracking-wide uppercase" style={{ gap: "0" }}>
              <span className="w-10 text-center">Hours</span>
              <span className="w-6"></span>
              <span className="w-10 text-center">Mins</span>
              <span className="w-6"></span>
              <span className="w-10 text-center">Secs</span>
            </div>
          </div>
        </div>
      </section>

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
                  onClick={() => {
                    setSelectedContest("Spring Microservices Sprint");
                    setActiveModal("register");
                  }}
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
                  onClick={() => {
                    setSelectedContest("Rust Memory Safety Duel");
                    setActiveModal("register");
                  }}
                  className="text-white font-bold py-2 px-6 rounded-full text-xs transition-colors hover:opacity-85"
                  style={{ backgroundColor: "var(--main-orange-color)" }}
                >Register</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <div className="flex justify-between items-center mt-6 mb-2">
        <p className="text-xs font-bold text-gray-500 tracking-wider uppercase">Recent Contests</p>
        <button
          className="text-xs font-bold text-gray-500 flex items-center gap-1 transition-colors"
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
              <button 
                onClick={() => {
                  setSelectedContest(c.title);
                  setActiveModal("view_problems");
                }}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
              >Editorial</button>
            </div>
          </div>
        ))}
      </div>

      {activeModal === "register" && (
        <ContestRegisterModal 
          contestName={selectedContest} 
          onClose={() => setActiveModal(null)} 
        />
      )}
      {activeModal === "view_problems" && (
        <ViewProblemsModal 
          contestName={selectedContest} 
          onClose={() => setActiveModal(null)} 
        />
      )}
    </div>
  );
}

