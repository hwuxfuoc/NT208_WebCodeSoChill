import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { contestBars } from "../../utils/mockData";

export default function ContestStatisticChart() {
  return (
    <section className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800">Contest Statistic</h3>
        <div className="flex items-center gap-4 text-xs ml-2">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#fcd34d]"></span> Last Month</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#49bb98]"></span> This Month</span>
          <select className="border-none outline-none bg-transparent text-gray-500 font-medium ml-4">
            <option>This Years</option>
          </select>
        </div>
      </div>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={contestBars} margin={{ top: 10, right: 10, bottom: 0 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
            <YAxis width={30} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="last" fill="#fcd34d" name="Last Month" radius={[4, 4, 0, 0]} barSize={8} />
            <Bar dataKey="now" fill="#49bb98" name="This Month" radius={[4, 4, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
