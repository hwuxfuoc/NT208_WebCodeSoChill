import { useModal } from "../../context/ModalContext";

const NOTIFS = [
  { id: 1, icon: "🕐", title: "Contest Reminder", body: "Biweekly Contest #42 starts in 30 minutes.", time: "30m ago", action: "Register Now" },
  { id: 2, icon: "✓",  title: "Submission Accepted", body: "Your submission for 'Two Sum' was accepted! Runtime: 45ms (faster than 92%).", time: "1h ago" },
  { id: 3, icon: "💬", title: "Community Reply", body: "Sarah Zen replied to your solution in the 'Dynamic Programming' thread.", time: "3h ago", action: "View" },
  { id: 4, icon: "⭐", title: "Weekly Challenge", body: "New Weekly Challenge is live! Solve it to earn 10 extra EXP.", time: "5h ago" },
  { id: 5, icon: "🏆", title: "New Badge Earned", body: "You earned the 'Speed Demon' badge for ranking in the top 1% of a contest.", time: "1d ago" },
  { id: 6, icon: "👥", title: "New Follower", body: "alex_devops started following your profile.", time: "2d ago" },
];

export default function NotificationsModal() {
  const { closeModal } = useModal();

  return (
    <div className="modal-panel w-[380px] p-0 overflow-hidden flex flex-col" style={{ maxHeight: "85vh" }}>
      <div className="px-6 pt-5 pb-4 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
        <div>
          <h2 className="text-base font-extrabold text-[#1A1D2B]">Notifications</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">6 unread</p>
        </div>
        <button onClick={closeModal} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1" style={{ scrollbarWidth: "thin" }}>
        {NOTIFS.map(n => (
          <div key={n.id} className="flex items-start gap-3 px-3 py-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
              {n.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <p className="text-[13px] font-bold text-[#1A1D2B] leading-tight">{n.title}</p>
                <span className="text-[10px] text-gray-400 font-semibold shrink-0 mt-0.5">{n.time}</span>
              </div>
              <p className="text-[12px] text-gray-500 leading-relaxed mt-0.5">{n.body}</p>
              {n.action && (
                <button className="text-[11px] font-bold mt-1.5 hover:underline" style={{ color: "var(--main-orange-color)" }}>
                  {n.action} →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
        <button className="flex-1 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">Mark all read</button>
        <button className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors">Clear all</button>
      </div>
    </div>
  );
}
