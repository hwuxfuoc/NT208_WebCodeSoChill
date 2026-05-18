import { Contest } from "../../services/contestService";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface CurrentContestProps {
  contest: Contest;
  onEnter: (contest: Contest) => void;
  onViewProblems: (contest: Contest) => void;
}

export default function CurrentContest({ contest, onEnter, onViewProblems }: CurrentContestProps) {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const end = new Date(contest.endTime).getTime();
    
    const updateTime = () => {
      const now = new Date().getTime();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft({ hours: 0, mins: 0, secs: 0 });
        return;
      }
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, mins, secs });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [contest.endTime]);

  const startDate = new Date(contest.startTime);

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
            <span className="text-xs font-medium text-gray-500">
              Started at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{contest.title}</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed pr-8 line-clamp-2">
            {contest.description}
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                const alreadyRegistered = contest.participants.some((pId) => pId === user?.id);
                if (contest.status === 'ongoing' && alreadyRegistered) {
                  onViewProblems(contest);
                } else {
                  onEnter(contest);
                }
              }}
              className="text-white font-bold py-2.5 px-6 rounded-full text-sm transition-colors shadow-lg hover:opacity-85"
              style={{ backgroundColor: "var(--main-orange-color)" }}
            >Enter Contest</button>
            <button 
              onClick={() => onViewProblems(contest)}
              className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-6 rounded-full text-sm border border-gray-200 transition-colors shadow-sm"
            >View Problems</button>
          </div>
        </div>

        <div className="w-[35%] bg-gray-100/50 rounded-3xl p-8 flex flex-col items-center justify-center relative z-10 border border-white/60 shadow-sm backdrop-blur-sm">
          <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-2">Ends In</span>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-4xl font-bold text-gray-800 tracking-tight tabular-nums">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-orange-500 leading-none">:</span>
              <span>{String(timeLeft.mins).padStart(2, '0')}</span>
              <span className="text-orange-500 leading-none">:</span>
              <span>{String(timeLeft.secs).padStart(2, '0')}</span>
            </div>
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
    </>
  );
}
