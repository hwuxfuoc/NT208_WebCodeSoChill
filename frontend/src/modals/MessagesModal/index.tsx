import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useModal } from "../../context/ModalContext";
import * as messageService from "../../services/messageService";
import { DEFAULT_AVATAR } from "../../utils/constants";

export default function MessagesModal() {
  const { closeModal } = useModal();
  const [active, setActive] = useState<string | null>(null);
  const [convos, setConvos] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadConvos = async () => {
      try {
        const res = await messageService.getConversations();
        if (cancelled) return;

        const fetchedConvos = res?.data?.conversations || [];
        setConvos(fetchedConvos);
        if (fetchedConvos.length > 0) {
          setActive((prev) => prev ?? String(fetchedConvos[0].id));
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error('Failed to load conversations', err);
          setError('Không thể tải cuộc trò chuyện. Vui lòng thử lại.');
        }
      }
    };

    loadConvos();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async (convId: string) => {
      try {
        const res = await messageService.getMessages(convId);
        if (!cancelled) {
          setMessages(res?.data?.messages || []);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error('Failed to load messages', err);
          setError('Không thể tải tin nhắn. Vui lòng thử lại.');
          setMessages([]);
        }
      }
    };

    if (active) {
      loadMessages(active);
    } else {
      setMessages([]);
    }

    return () => { cancelled = true; };
  }, [active]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      setError(null);

      try {
        const res = await messageService.searchUsers(searchTerm.trim());
        if (!controller.signal.aborted) {
          setSearchResults(res?.data?.users || []);
        }
      } catch (err: any) {
        if (!controller.signal.aborted) {
          console.error('Search user failed', err);
          setError('Không thể tìm kiếm user. Vui lòng thử lại.');
        }
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchTerm]);

  const handleSelectUser = async (user: any) => {
    setError(null);
    setSearchTerm("");
    setSearchResults([]);

    try {
      const participantId = user._id || user.id;
      const res = await messageService.createConversation(participantId);
      const conversation = res?.data?.conversation;
      if (!conversation) return;

      setConvos((prev) => {
        const exists = prev.find((c) => String(c.id) === String(conversation.id));
        if (exists) {
          return prev.map((c) => (String(c.id) === String(conversation.id) ? conversation : c));
        }
        return [conversation, ...prev];
      });

      setActive(String(conversation.id));
    } catch (err: any) {
      console.error('Create conversation failed', err);
      setError(err.response?.data?.message || 'Không thể bắt đầu cuộc trò chuyện.');
    }
  };

  const handleSendMessage = async () => {
    if (!active || !draft.trim()) return;
    setSending(true);
    setError(null);

    try {
      const res = await messageService.sendMessage(active, { text: draft.trim() });
      const newMessage = res?.data?.message;
      if (!newMessage) return;

      setMessages((prev) => [...prev, newMessage]);
      setDraft("");

      setConvos((prev) => prev.map((c) => {
        if (String(c.id) !== String(active)) return c;
        return {
          ...c,
          last: newMessage.text,
          time: newMessage.time,
        };
      }));
    } catch (err: any) {
      console.error('Send message failed', err);
      setError(err.response?.data?.message || 'Gửi tin nhắn thất bại.');
    } finally {
      setSending(false);
    }
  };

  const convo = convos.find(c => String(c.id) === String(active)) || null;

  return (
    <motion.div
      className="modal-panel w-[780px] h-[520px] p-0 flex overflow-hidden border-none shadow-2xl"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="w-[280px] border-r border-gray-100 flex flex-col bg-white">
        <div className="px-5 pt-5 pb-3 flex justify-between items-center">
          <h2 className="text-base font-extrabold text-[#1A1D2B]">Messages</h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"></path></svg>
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs outline-none text-gray-600 flex-1"
              placeholder="Search username..."
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {searchTerm.trim().length >= 2 ? (
            <div className="space-y-2 px-3">
              {searchLoading ? (
                <div className="text-sm text-gray-500">Đang tìm kiếm...</div>
              ) : searchResults.length === 0 ? (
                <div className="text-sm text-gray-500">Không tìm thấy user nào.</div>
              ) : (
                searchResults.map((user) => (
                  <button
                    key={user._id || user.username}
                    onClick={() => handleSelectUser(user)}
                    className="w-full text-left rounded-2xl border border-gray-100 px-3 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayname || user.username)}`}
                        alt={user.displayname || user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1A1D2B]">{user.displayname || user.username}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user.username}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : convos.length === 0 ? (
            <div className="px-4 py-5 text-sm text-gray-500">Không có cuộc trò chuyện nào. Bắt đầu chat để tạo lịch sử.</div>
          ) : (
            convos.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(String(c.id))}
                className={`w-full flex items-center gap-3 px-4 py-3 border-l-4 transition-colors text-left ${String(active) === String(c.id) ? "bg-orange-50/60 border-l-[var(--main-orange-color)]" : "border-l-transparent hover:bg-gray-50"}`}
              >
                <div className="relative shrink-0">
                  <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full" />
                  {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-bold text-[#1A1D2B]">{c.name}</span>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <p className={`text-[11px] truncate ${String(active) === String(c.id) ? "text-orange-500 font-semibold" : "text-gray-400"}`}>{c.last}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#fafbfc] relative">
        <button onClick={closeModal} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors z-10">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-white">
          <div className="relative">
            <img src={convo?.avatar ?? DEFAULT_AVATAR} alt={convo?.name ?? 'User'} className="w-8 h-8 rounded-full" />
            {convo?.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />}
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1D2B]">{convo?.name || 'Chọn cuộc hội thoại'}</p>
            <p className="text-[10px] font-semibold text-green-500">{convo ? (convo.online ? 'Online Now' : 'Offline') : 'Chưa có cuộc hội thoại'}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <div className="text-center">
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
          </div>
          {messages.map(m => (
            <div key={m.id} className={`flex items-end gap-2 max-w-[78%] ${m.me ? "ml-auto flex-row-reverse" : ""}`}>
              {!m.me && <img src={convo?.avatar ?? ''} alt="" className="w-7 h-7 rounded-full mb-1 shrink-0" />}
              <div className={`px-4 py-2.5 rounded-2xl ${m.me ? "rounded-br-none" : "rounded-bl-none"}`}
                style={m.me ? { backgroundColor: "var(--main-orange-color)" } : { backgroundColor: "#f0f4f8" }}>
                <p className={`text-sm leading-relaxed ${m.me ? "text-white" : "text-gray-800"}`}>{m.text}</p>
                <span className={`text-[10px] font-semibold block mt-1 ${m.me ? "text-orange-200 text-right" : "text-gray-400"}`}>{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-end gap-3 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message (Shift+Enter for newline)..."
              className="flex-1 min-h-[40px] max-h-28 bg-transparent text-sm outline-none text-gray-700 resize-none"
              disabled={!convo}
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!convo || sending || !draft.trim()}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "var(--main-orange-color)" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}