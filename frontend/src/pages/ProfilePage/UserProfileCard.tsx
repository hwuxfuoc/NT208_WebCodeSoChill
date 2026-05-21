import { useState } from "react";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../hooks/useAuth";
import { DEFAULT_AVATAR } from "../../utils/constants";

interface UserProfileCardProps {
  user?: any;
  stats?: any;
  isOwnProfile?: boolean;
}

export default function UserProfileCard({ user, stats, isOwnProfile = false }: UserProfileCardProps) {
  const { openModal } = useModal();
  const { user: currentUser } = useAuth();
  const [showShare, setShowShare] = useState(false);

  const toggleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShare(!showShare);
  };

  const displayUser = user || currentUser;
  const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Jan 2022';

  const RANK_CONFIG: Record<string, { bg: string; text: string }> = {
    'Grandmaster': { bg: '#eab308', text: '#fff' },
    'Master':      { bg: '#ef4444', text: '#fff' },
    'Expert':      { bg: '#f97316', text: '#fff' },
    'Pro':         { bg: '#a855f7', text: '#fff' },
    'Skilled':     { bg: '#3b82f6', text: '#fff' },
    'Amateur':     { bg: '#14b8a6', text: '#fff' },
    'Beginner':    { bg: '#22c55e', text: '#fff' },
    'Noob':        { bg: '#6b7280', text: '#fff' },
  };
  const rankCfg = RANK_CONFIG[stats?.rank || 'Noob'] ?? RANK_CONFIG['Noob'];

  // Level progress bar
  const exp = stats?.experiencePoints ?? 0;
  const level = stats?.level ?? (Math.floor(exp / 100) + 1);
  const expInLevel = exp % 100;          // 0–99 EXP trong level hiện tại
  const progressPct = expInLevel;        // 0–100 %

  return (
    <section className="card flex items-center gap-6 relative overflow-visible z-50" onClick={() => setShowShare(false)}>
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: "var(--main-orange-color)", opacity: 0.06 }} />

      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md">
          <img src={displayUser?.avatarUrl || DEFAULT_AVATAR} alt={displayUser?.displayname} className="w-full h-full object-cover" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
      </div>

      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-2xl font-extrabold text-[#1A1D2B]">{displayUser?.displayname}</h2>
          <span
            className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider"
            style={{ backgroundColor: rankCfg.bg, color: rankCfg.text }}
          >
            {stats?.rank || 'Noob'}
          </span>
          {/* EXP kế rank */}
          <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#f97316' }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {exp.toLocaleString()} EXP
          </span>
        </div>

        {/* Level + Progress bar */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-black text-gray-400 shrink-0 uppercase tracking-wide">
            Lv.{level}
          </span>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%`, backgroundColor: '#22c55e' }}
            />
          </div>
          <span className="text-[10px] font-bold text-gray-400 shrink-0 tabular-nums">
            {expInLevel}/100
          </span>
        </div>
        <p className="text-sm text-gray-500 font-medium flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--main-orange-color)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            {stats?.totalSolved || 0} Solved
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Joined {joinDate}
          </span>
        </p>
      </div>

      <div className="relative z-20 flex items-center gap-3 ml-auto shrink-0">
        <div className="relative">
          <button onClick={toggleShare} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </button>
          {showShare && (
            <div className="absolute top-12 right-0 bg-[#2a2a3e] p-4 rounded-2xl shadow-xl w-[280px] z-50" onClick={e => e.stopPropagation()}>
              <p className="text-white text-sm font-bold mb-4">Share Profile</p>
              <div className="flex justify-between mb-5">
                {[
                  { name: "Facebook", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>, bg: "bg-blue-600 text-white" },
                  { name: "WhatsApp", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>, bg: "bg-green-500 text-white" },
                  { name: "X", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="4" x2="20" y2="20"></line><line x1="20" y1="4" x2="4" y2="20"></line></svg>, bg: "bg-black text-white" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full ${item.bg}`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] text-gray-300 font-semibold">{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-[#1e1e2e] rounded-xl p-1.5 border border-[#3e3e5e]">
                <div className="flex-1 overflow-hidden px-2">
                  <p className="text-xs text-gray-400 truncate">https://codesochill.dev/profile/{displayUser?.username}</p>
                </div>
                <button className="px-4 py-1.5 rounded-lg bg-gray-800 text-white text-[11px] font-bold hover:bg-gray-700 transition-colors shrink-0">
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
        {isOwnProfile && (
          <button onClick={() => openModal("settings")} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-md hover:opacity-90 transition-all" style={{ backgroundColor: "var(--main-orange-color)" }}>
            Edit Profile
          </button>
        )}
      </div>
    </section>
  );
}
