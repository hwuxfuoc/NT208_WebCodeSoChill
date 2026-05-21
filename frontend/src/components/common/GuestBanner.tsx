import { useNavigate } from "react-router-dom";

interface GuestBannerProps {
  page: "community" | "contest" | "profile";
}

const PAGE_CONFIG = {
  community: {
    title: "Join the Community",
    desc: "Sign in to create posts, react, comment, and connect with other coders.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  contest: {
    title: "Compete in Contests",
    desc: "Sign in to register for contests, submit solutions, and climb the rankings.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  profile: {
    title: "Your Profile",
    desc: "Sign in to view your profile, track progress, and showcase your achievements.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
};

export default function GuestBanner({ page }: GuestBannerProps) {
  const navigate = useNavigate();
  const cfg = PAGE_CONFIG[page];

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
        style={{ background: "linear-gradient(135deg, var(--main-orange-color), #e85a46)" }}
      >
        {cfg.icon}
      </div>
      <div className="text-center max-w-sm">
        <h2 className="text-2xl font-extrabold text-[#1A1D2B] mb-2">{cfg.title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed">{cfg.desc}</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/login")}
          className="px-7 py-3 rounded-2xl font-bold text-sm text-white shadow-md hover:opacity-90 transition-all"
          style={{ backgroundColor: "var(--main-orange-color)" }}
        >
          Sign In
        </button>
        <button
          onClick={() => navigate("/register")}
          className="px-7 py-3 rounded-2xl font-bold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
        >
          Register
        </button>
      </div>
    </div>
  );
}
