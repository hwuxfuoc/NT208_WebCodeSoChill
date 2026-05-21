import { useNavigate } from "react-router-dom";
import BannerPromo from "./BannerPromo";
import ContestStatisticChart from "./ContestStatisticChart";
import DailyProblemsChart from "./DailyProblemsChart";
import DailyChallengeCard from "./DailyChallengeCard";
import StatRow from "./StatRow";
import { useAuth } from "../../hooks/useAuth";

function GuestHero() {
  const navigate = useNavigate();
  return (
    <section className="card flex flex-col items-center justify-center text-center py-14 px-8 gap-6 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #fdba74, var(--main-orange-color))", border: "none" }}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Start Your Coding Journey</h2>
          <p className="text-white/80 text-[15px] max-w-md leading-relaxed">
            Join thousands of developers. Track your progress, solve daily challenges and compete in contests.
          </p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 rounded-xl bg-white font-bold text-[15px] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ color: "var(--main-orange-color)" }}
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-xl bg-white/20 text-white font-bold text-[15px] hover:bg-white/30 transition-all border border-white/30"
          >
            Sign In
          </button>
        </div>
      </div>
    </section>
  );
}

function GuestProblemTeaser() {
  const navigate = useNavigate();
  const features = [
    { title: "Daily Challenges", desc: "Solve curated problems every day to build consistent habits." },
    { title: "Random Challenge", desc: "Pick a random problem and test your skills anytime." },
    { title: "Contests", desc: "Compete with others in timed competitions and climb the leaderboard." },
    { title: "Progress Tracking", desc: "Visualize your streak, solved problems and improvement over time." },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {features.map((f) => (
        <section
          key={f.title}
          onClick={() => navigate("/register")}
          className="card cursor-pointer hover:-translate-y-1 transition-all flex flex-col gap-3 p-6"
          style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}
        >
          <h3 className="font-extrabold text-[17px] text-[#1A1D2B]">{f.title}</h3>
          <p className="text-gray-500 text-[13px] leading-relaxed">{f.desc}</p>
          <span className="text-[12px] font-bold mt-auto" style={{ color: "var(--main-orange-color)" }}>
            Sign up to unlock →
          </span>
        </section>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-stack h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-stack">
        <div className="page-header">
          <h1>Homepage</h1>
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <BannerPromo />
          <StatRow />
        </div>
        <div className="mt-4">
          <GuestHero />
        </div>
        <GuestProblemTeaser />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <div className="page-header">
        <h1>Homepage</h1>
      </div>
      <div className="home-grid-top">
        <div className="flex flex-col gap-4">
          <BannerPromo />
          <StatRow />
        </div>
        <ContestStatisticChart />
      </div>
      <div className="home-grid-bottom mt-4">
        <DailyProblemsChart />
        <DailyChallengeCard />
      </div>
    </div>
  );
}
