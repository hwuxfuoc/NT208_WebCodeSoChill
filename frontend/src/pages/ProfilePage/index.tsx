import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const rating = [{ m: "Jan", r: 1800 }, { m: "Feb", r: 1920 }, { m: "Mar", r: 2050 }, { m: "Apr", r: 1980 }, { m: "May", r: 2415 }];

export default function ProfilePage() {
  return (
    <div className="page-stack">
      <h1>Profile</h1>
      <section className="card">
        <h2>Alex Rivera</h2>
        <p>Grandmaster · Top 0.5% globally · Joined Jan 2022</p>
      </section>

      <div className="page-grid-2">
        <section className="card"><h3>Activity Heatmap</h3><div className="heatmap">{Array.from({ length: 56 }).map((_, i) => <span key={i} className={`heat ${i % 5 === 0 ? "strong" : i % 3 === 0 ? "mid" : ""}`} />)}</div></section>
        <section className="card"><h3>Contest Rating 2,415</h3><div style={{ width: "100%", height: 160 }}><ResponsiveContainer><LineChart data={rating}><XAxis dataKey="m" /><YAxis /><Tooltip /><Line type="monotone" dataKey="r" stroke="#ff7f66" strokeWidth={3} /></LineChart></ResponsiveContainer></div></section>
      </div>

      <div className="page-grid-2">
        <section className="card"><h3>Solved Problems</h3><p>Easy 82% · Medium 48% · Hard 28%</p><strong>Total solved: 1,402</strong></section>
        <section className="card"><h3>Recent Badges</h3><p>Algorithmic Ace</p><p>Speed Demon</p></section>
      </div>
    </div>
  );
}
