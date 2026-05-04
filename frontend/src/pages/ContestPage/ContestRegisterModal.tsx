import { useState } from "react";

interface ContestRegisterModalProps {
  onClose: () => void;
  contestName: string;
  isLive?: boolean;
  startTime?: string;
}

export default function ContestRegisterModal({ onClose, contestName, isLive = false, startTime }: ContestRegisterModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
              <h2 className="text-2xl font-extrabold text-[#1A1D2B] mt-1 leading-tight">{contestName}</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Alex Rivera"
                  className="w-full bg-[#f4f6f8] rounded-xl px-4 py-3 text-sm text-gray-700 outline-none border border-transparent focus:border-orange-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Email</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full bg-[#f4f6f8] rounded-xl px-4 py-3 text-sm text-gray-700 outline-none border border-transparent focus:border-orange-400 transition-colors"
                />
              </div>

              {isLive ? (
                <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></span>
                  <span className="text-sm font-semibold text-emerald-700">Contest is happening right now!</span>
                </div>
              ) : startTime ? (
                <div className="flex items-center gap-2.5 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span className="text-sm font-semibold text-blue-700">Contest will start on {startTime}</span>
                </div>
              ) : null}

              <button
                type="submit"
                className="mt-2 w-full py-3 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-85"
                style={{ backgroundColor: "var(--main-orange-color)" }}
              >
                Confirm Registration
              </button>
            </form>
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
            <p className="text-gray-500 text-sm mb-6">You're all set for <strong>{contestName}</strong>. Good luck!</p>
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
