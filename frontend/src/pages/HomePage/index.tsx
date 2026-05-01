import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { contestBars, dailyLine } from "../../utils/mockData";

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{title}</span>
      <small>{subtitle}</small>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="page-stack">
      <h1>Homepage</h1>
      <div className="home-grid-top">
        <section className="card promo">
          <h2>Join Now and Get Discount Voucher Up to 20%</h2>
          <p>Become a membership to get more benefits! Limited deal this week.</p>
          <div className="stats-row">
            <StatCard title="Problems" value="1,500+" subtitle="Practice every day" />
            <StatCard title="Contest / month" value="20+" subtitle="Weekly challenge" />
            <StatCard title="Community" value="200+" subtitle="Active members" />
          </div>
        </section>
        <section className="card">
          <h3>Contest Statistic</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={contestBars}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="last" fill="var(--main-green-color)" name="Last Month" />
                <Bar dataKey="now" fill="var(--main-orange-color)" name="This Month" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="home-grid-bottom">
        <section className="card">
          <h3>Daily Problems</h3>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <LineChart data={dailyLine}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="d" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="last" stroke="#95a1b7" strokeWidth={2} />
                <Line type="monotone" dataKey="now" stroke="var(--main-green-color)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card challenge-card">
          <h3>Today's Challenge</h3>
          <p>Solve 10 easy problems to get 100 EXP.</p>
          <div className="progress-outer"><div className="progress-inner" style={{ width: "30%" }} /></div>
          <ul>
            <li>Reverse String Pairs</li>
            <li>Palindrome Check XL</li>
          </ul>
          <button className="btn-light">Go to Problem</button>
        </section>
      </div>
    </div>
  );
}
