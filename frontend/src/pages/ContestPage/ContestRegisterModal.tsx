import { useState } from "react";
import { Contest, registerContest } from "../../services/contestService";
import { useAuth } from "../../hooks/useAuth";

interface ContestRegisterModalProps {
  onClose: () => void;
  contest: Contest;
}

export default function ContestRegisterModal({ onClose, contest }: ContestRegisterModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const isLive = contest.status === "ongoing";
  const startDate = new Date(contest.startTime);
  const startTimeStr = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  // Kiểm tra nếu user đã đăng ký rồi
  const alreadyRegistered = contest.participants.some(pId => pId === user?.id);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await registerContest(contest._id);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {!submitted ? (
          <>
            <div className="mb-6">
              <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: "var(--main-orange-color)" }}>Register</span>
              <h2 className="text-2xl font-extrabold text-[#1A1D2B] mt-1 leading-tight">{contest.title}</h2>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600 mb-2">
                Click the button below to confirm your registration for this contest.
              </p>

              {isLive ? (
                <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                  <span className="text-sm font-semibold text-emerald-700">Contest is happening right now!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span className="text-sm font-semibold text-blue-700">Contest will start on {startTimeStr}</span>
                </div>
              )}

              {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

              {alreadyRegistered ? (
                <button
                  disabled
                  className="mt-2 w-full py-3 rounded-xl font-bold text-gray-500 bg-gray-200 text-sm cursor-not-allowed"
                >
                  Already Registered
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-2 w-full py-3 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ backgroundColor: "var(--main-orange-color)" }}
                >
                  {loading ? "Registering..." : "Confirm Registration"}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "var(--main-green-color)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="text-xl font-extrabold text-[#1A1D2B] mb-2">Registered!</h3>
            <p className="text-gray-500 text-sm mb-6">You're all set for <strong>{contest.title}</strong>. Good luck!</p>
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-xl font-bold text-white text-sm hover:opacity-85 transition-opacity"
              style={{ backgroundColor: "var(--main-orange-color)" }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
