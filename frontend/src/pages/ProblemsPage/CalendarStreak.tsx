import { useState } from "react";

// Calendar helpers
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const STREAK_DAYS = new Set([3, 7, 10, 11, 12, 14, 17]); // days with solved problems
const TODAY = 17;

export default function CalendarStreak() {
  const [month] = useState("January, 2024");

  return (
    <section
      className="rounded-3xl shadow-md text-white relative overflow-hidden"
      style={{ backgroundColor: "var(--main-orange-color)" }}
    >
      {/* Month header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span className="font-bold text-[15px]">{month}</span>
        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-4 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-[11px] font-bold text-white/60 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid - starts on Mon (day 1 = Mon for Jan 2024) */}
      <div className="grid grid-cols-7 px-4 pb-4 gap-1">
        {Array.from({ length: 25 }, (_, i) => i + 1).map((day) => {
          const isToday = day === TODAY;
          const isSolved = STREAK_DAYS.has(day);
          return (
            <div
              key={day}
              className="w-7 h-7 mx-auto flex items-center justify-center rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
              style={
                isToday
                  ? { backgroundColor: "#fff", color: "var(--main-orange-color)", fontWeight: 800 }
                  : isSolved
                  ? { backgroundColor: "#fff", color: "var(--main-orange-color)", fontWeight: 700, opacity: 0.9 }
                  : { color: "rgba(255,255,255,0.75)" }
              }
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Streak badge */}
      <div className="bg-white/15 mx-4 mb-4 rounded-2xl px-4 py-3 flex flex-col items-center text-center">
        <p className="text-[20px] font-black flex items-center justify-center gap-2 whitespace-nowrap">
          🔥 Streak 7 days!
        </p>
        <p className="text-[12px] text-white/80 mt-0.5">Keep up the great work, Alex!</p>
      </div>
    </section>
  );
}
