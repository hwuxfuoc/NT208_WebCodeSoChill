import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dailyLine } from "../../utils/mockData";

export default function DailyProblemsChart() {
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
        <ResponsiveContainer>
          <LineChart data={dailyLine} margin={{ top: 25, right: 10, left: -3, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
            <YAxis width={30} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip />
            <Line type="monotone" dataKey="last" stroke="#fb923c" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="now" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
