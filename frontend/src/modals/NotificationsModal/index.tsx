import { useModal } from "../../context/ModalContext";
import { useEffect, useState } from "react";
import * as notificationService from "../../services/notificationService";

type NotificationItem = {
  _id: string;
  title: string;
  body?: string;
  time?: string;
  icon?: string;
  unread?: boolean;
};

export default function NotificationsModal() {
  const { closeModal } = useModal();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await notificationService.getNotifications();
        if (!isCancelled) {
          // Normalize backend shape to NotificationItem
          const items = (res.data.notifications || res.data || []).map((n: any) => ({
            _id: n._id || n.id,
            title: n.title || n.message || n.body || "Notification",
            body: n.body || n.message || "",
            time: n.time || n.createdAt || undefined,
            icon: n.icon || undefined,
            unread: n.unread === undefined ? false : n.unread,
          }));
          setNotifications(items);
        }
      } catch (err: any) {
        if (!isCancelled) setError(err.response?.data?.message || 'Failed to load notifications');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    load();
    return () => { isCancelled = true; };
  }, []);

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map(n => ({ ...n, unread: false })));
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-panel w-[380px] p-0 overflow-hidden flex flex-col" style={{ maxHeight: "85vh" }}>
      <div className="px-6 pt-5 pb-4 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
        <div>
          <h2 className="text-base font-extrabold text-[#1A1D2B]">Notifications</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">{notifications.filter(n => n.unread).length} unread</p>
        </div>
        <button onClick={closeModal} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1" style={{ scrollbarWidth: "thin" }}>
        {loading && <div className="text-sm text-gray-500 px-3 py-2">Loading...</div>}
        {error && <div className="text-sm text-red-500 px-3 py-2">{error}</div>}
        {notifications.map(n => (
          <div key={n._id} className={`flex items-start gap-3 px-3 py-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? 'bg-white' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
              {n.icon || '🔔'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <p className="text-[13px] font-bold text-[#1A1D2B] leading-tight">{n.title}</p>
                <span className="text-[10px] text-gray-400 font-semibold shrink-0 mt-0.5">{n.time ? new Date(n.time).toLocaleString() : ''}</span>
              </div>
              <p className="text-[12px] text-gray-500 leading-relaxed mt-0.5">{n.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
        <button onClick={markAllRead} className="flex-1 py-2 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">Mark all read</button>
        <button onClick={clearAll} className="flex-1 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors">Clear all</button>
      </div>
    </div>
  );
}
