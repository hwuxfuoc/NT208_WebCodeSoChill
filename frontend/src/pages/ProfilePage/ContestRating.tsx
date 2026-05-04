import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const DATA_4M = [{ m: "Jan", r: 1800 }, { m: "Feb", r: 1920 }, { m: "Mar", r: 2050 }, { m: "Apr", r: 1980 }, { m: "May", r: 2415 }];
const DATA_1Y = [
  { m: "Jun", r: 1600 }, { m: "Jul", r: 1720 }, { m: "Aug", r: 1680 }, { m: "Sep", r: 1800 },
  { m: "Oct", r: 1920 }, { m: "Nov", r: 2050 }, { m: "Dec", r: 1980 }, { m: "Jan", r: 2100 },
  { m: "Feb", r: 2200 }, { m: "Mar", r: 2300 }, { m: "Apr", r: 2380 }, { m: "May", r: 2415 },
];

export default function ContestRating() {
  const [period, setPeriod] = useState<"4M" | "1Y">("4M");
  const data = period === "4M" ? DATA_4M : DATA_1Y;

  return (
    <section className="card flex flex-col">
      <div className="flex justify-between items-start mb-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Contest Rating</p>
        <div className="flex gap-1">
          {(["4M", "1Y"] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${period === p ? "text-white" : "text-gray-400 hover:text-gray-600"}`}
              style={period === p ? { backgroundColor: "var(--main-orange-color)" } : {}}
            >{p}</button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <span className="text-2xl font-extrabold text-[#1A1D2B]">2,415</span>
        <span className="text-xs font-bold text-green-500 ml-2">↑ 124 this month</span>
      </div>
      <div style={{ width: "100%", height: 160 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#9ca3af" }} dy={8} />
            <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
            <Tooltip cursor={{ stroke: "#f0f2f5" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: "12px" }} />
            <Line type="monotone" dataKey="r" stroke="var(--main-orange-color)" strokeWidth={3}
              dot={{ r: 4, fill: "#fff", strokeWidth: 2, stroke: "var(--main-orange-color)" }}
              activeDot={{ r: 6, fill: "var(--main-orange-color)", stroke: "#fff", strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
