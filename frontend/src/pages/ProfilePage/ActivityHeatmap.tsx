import { useEffect, useState } from "react";
import * as profileService from "../../services/profileService";

interface ActivityHeatmapProps {
  userId?: string;
}

export default function ActivityHeatmap({ userId }: ActivityHeatmapProps) {
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    if (!userId) return;
    setLoading(true);
    profileService.getUserCalendar(userId)
      .then(res => {
        if (isCancelled) return;
        const arr: string[] = res.data.activeDates || [];
        setActiveDates(new Set(arr));
      })
      .catch(err => console.error(err))
      .finally(() => { if (!isCancelled) setLoading(false); });

    return () => { isCancelled = true; };
  }, [userId]);

  const days = 98; // ~14 weeks
  const today = new Date();
  const lastDays = Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    return d;
  });

  const getColor = (dateStr: string) => {
    return activeDates.has(dateStr) ? 'bg-teal-500' : 'bg-gray-100';
  };

  return (
    <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl text-[#1A1D2B]">Activity</h3>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1.5 rounded-lg">Last 3 Months</span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5 overflow-x-auto pb-2">
          {loading && <div className="text-sm text-gray-500 col-span-14">Loading...</div>}
          {!loading && lastDays.map((d, i) => {
            const dateStr = d.toISOString().slice(0,10);
            return (
              <div key={i} className={`w-3.5 h-3.5 rounded-[3px] ${getColor(dateStr)}`} title={dateStr} />
            );
          })}
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
