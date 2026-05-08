import { useState, useEffect } from 'react';
import StatCard from "./StatCard";
import * as problemService from "../../services/problemService";
import * as profileService from "../../services/profileService";

export default function StatRow() {
  const [stats, setStats] = useState({
    totalProblems: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [problemsRes, leaderboardRes] = await Promise.all([
          problemService.getProblems({ page: 1, limit: 1 }),
          profileService.getLeaderboard(1, 1),
        ]);
        setStats({
          totalProblems: problemsRes.data.total || 0,
          totalUsers: leaderboardRes.data.total || 0,
        });
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="stats-row mt-0 h-28">
      <StatCard 
        title="Problems" 
        value={loading ? "..." : stats.totalProblems + "+"} 
        color="bg-[var(--main-green-color)]"
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>} 
      />
      <StatCard 
        title="Contest per month" 
        value="20+" 
        color="bg-[#1F2532]"
        icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>} 
      />
      <StatCard 
        title="Users" 
        value={loading ? "..." : stats.totalUsers + "+"} 
        color="bg-[var(--main-orange-color)]"
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="4"></line><line x1="12" y1="20" x2="12" y2="22"></line><line x1="4" y1="12" x2="2" y2="12"></line><line x1="22" y1="12" x2="20" y2="12"></line><line x1="19.07" y1="4.93" x2="17.66" y2="6.34"></line><line x1="6.34" y1="17.66" x2="4.93" y2="19.07"></line><line x1="19.07" y1="19.07" x2="17.66" y2="17.66"></line><line x1="6.34" y1="6.34" x2="4.93" y2="4.93"></line></svg>} 
      />
    </div>
  );
}
