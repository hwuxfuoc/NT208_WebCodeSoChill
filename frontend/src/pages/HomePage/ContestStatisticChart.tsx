import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getContestStats, ContestStatisticChartItem } from "../../services/statService";

export default function ContestStatisticChart() {
  const [data, setData] = useState<ContestStatisticChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadData = async () => {
      try {
        const response = await getContestStats();
        if (!isCancelled) {
          setData(response.data.contestStats || []);
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(err.response?.data?.message || 'Failed to load contest statistics');
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
        <div>
          <h3 className="font-bold text-gray-800">Contest Statistic</h3>
          <p className="text-sm text-gray-500">Competition activity across the year</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Last Year</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-700"></span> This Year</span>
        </div>
      </div>
      <div style={{ width: "100%", height: 320 }}>
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500">Loading chart…</div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-sm text-red-500">{error}</div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500">No contest statistics available</div>
        ) : (
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d5db" strokeOpacity={0.9} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis width={30} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip />
              <Bar dataKey="last" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="now" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
