import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getDailyProblemsChart, DailyProblemsChartItem } from "../../services/statService";

export default function DailyProblemsChart() {
  const [data, setData] = useState<DailyProblemsChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      try {
        const response = await getDailyProblemsChart();
        if (!isCancelled) {
          setData(response.data.dailyProblems || []);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.response?.data?.message || 'Failed to load daily problems data');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800">Daily Problems</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-orange-400"></span> Last Week</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full border-2 border-teal-500"></span> This Week</span>
        </div>
      </div>
      <div style={{ width: "100%", height: 300 }}>
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading chart…</div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-sm text-red-500">{error}</div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500">No activity data available</div>
        ) : (
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 25, right: 10, left: -3, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" strokeOpacity={0.9} />
              <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis width={30} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip />
              <Line type="monotone" dataKey="last" stroke="#fb923c" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="now" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
