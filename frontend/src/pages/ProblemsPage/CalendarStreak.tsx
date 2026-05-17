import { useState, useEffect } from "react";
import { getUserCalendar } from "../../services/profileService";
import { useAuth } from "../../hooks/useAuth";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export default function CalendarStreak() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (user?.id) {
      getUserCalendar(user.id)
        .then((res) => {
          setActiveDates(new Set(res.data.activeDates));
          setStreak(res.data.currentStreak);
        })
        .catch((err) => {
          console.error("Failed to fetch calendar", err);
        });
    }
  }, [user]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Calendar calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust so Monday is 0 and Sunday is 6
  const emptyDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const todayDate = today.getDate();

  return (
    <section
      className="rounded-3xl shadow-md text-white relative overflow-hidden"
      style={{ backgroundColor: "var(--main-orange-color)" }}
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <button
          onClick={handlePrevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <span className="font-bold text-[15px]">{`${monthName}, ${year}`}</span>
        <button
          onClick={handleNextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 px-4 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-[11px] font-bold text-white/60 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 px-4 pb-4 gap-1">
        {/* Empty padding days */}
        {Array.from({ length: emptyDays }).map((_, i) => (
          <div key={`empty-${i}`} className="w-7 h-7" />
        ))}

        {/* Actual days */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const yyyy = year;
          const mm = String(month + 1).padStart(2, '0');
          const dd = String(day).padStart(2, '0');
          const dateStr = `${yyyy}-${mm}-${dd}`;
          
          // Determine if date matches today precisely using local year/month/day
          const isToday = isCurrentMonth && day === todayDate;
          const isSolved = activeDates.has(dateStr);

          return (
            <div
              key={day}
              className="w-7 h-7 mx-auto flex items-center justify-center rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
              title={dateStr}
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

      {user && (
        <div className="bg-white/15 mx-4 mb-4 rounded-2xl px-4 py-3 flex flex-col items-center text-center">
          <p className="text-[20px] font-black flex items-center justify-center gap-2 whitespace-nowrap">
            🔥 Streak {streak} {streak === 1 ? "day" : "days"}!
          </p>
          <p className="text-[12px] text-white/80 mt-0.5">Keep up the great work, {user.displayname.split(" ")[0]}!</p>
        </div>
      )}
    </section>
  );
}
