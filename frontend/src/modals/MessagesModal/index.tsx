import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useModal } from "../../context/ModalContext";
import * as messageService from "../../services/messageService";
import { DEFAULT_AVATAR } from "../../utils/constants";

export default function MessagesModal() {
  const { closeModal, modalData } = useModal();
  const [active, setActive] = useState<string | null>(null);
  const [convos, setConvos] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  
  // Mobile view state: "list" shows list of users/convos, "chat" shows selected convo
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  useEffect(() => {
    if (modalData && modalData.action === 'open_chat' && modalData.user) {
      handleSelectUser(modalData.user);
      setMobileView("chat");
    }
  }, [modalData]);

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

  async function handleSelectUser(user: any) {
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
      setMobileView("chat");
    } catch (err: any) {
      console.error('Create conversation failed', err);
      setError(err.response?.data?.message || 'Không thể bắt đầu cuộc trò chuyện.');
    }
  }

  const handleSelectConvo = (id: string) => {
    setActive(id);
    setMobileView("chat");
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
      className="modal-panel messages-modal relative w-[780px] max-w-[95vw] h-[540px] max-h-[90vh] p-0 flex overflow-hidden border-none shadow-2xl rounded-3xl"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* ── Single Fixed Close Button (X) at Top Right (Matches Settings & Notifications) ── */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-30"
        title="Close"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      {/* ── 1. CONVERSATION / USER LIST PANEL ── */}
      <div className={`w-full md:w-[280px] border-r border-gray-100 flex-col bg-white shrink-0 ${
        mobileView === "chat" ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="px-5 pt-5 pb-3 flex justify-between items-center pr-12">
          <h2 className="text-base font-extrabold text-[#1A1D2B]">Messages</h2>
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
                <div className="text-xs text-gray-400 p-3">Searching...</div>
              ) : searchResults.length === 0 ? (
                <div className="text-xs text-gray-400 p-3">No users found.</div>
              ) : (
                searchResults.map((u) => (
                  <button
                    key={u._id || u.username}
                    onClick={() => handleSelectUser(u)}
                    className="w-full text-left rounded-2xl border border-gray-100 px-3 py-2.5 hover:bg-gray-50 flex items-center gap-3"
                  >
                    <img
                      src={u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.displayname || u.username)}`}
                      alt={u.displayname || u.username}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1A1D2B]">{u.displayname || u.username}</p>
                      <p className="text-[11px] text-gray-400 truncate">@{u.username}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : convos.length === 0 ? (
            <div className="px-5 py-8 text-center text-xs text-gray-400">No conversations yet. Search user to chat.</div>
          ) : (
            convos.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelectConvo(String(c.id))}
                className={`w-full flex items-center gap-3 px-4 py-3 border-l-4 transition-colors text-left ${String(active) === String(c.id) ? "bg-orange-50/60 border-l-[var(--main-orange-color)]" : "border-l-transparent hover:bg-gray-50"}`}
              >
                <div className="relative shrink-0">
                  <img src={c.avatar || DEFAULT_AVATAR} alt={c.name} className="w-9 h-9 rounded-full object-cover" />
                  {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-bold text-[#1A1D2B] truncate">{c.name}</span>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-1">{c.time}</span>
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${String(active) === String(c.id) ? "text-orange-500 font-semibold" : "text-gray-400"}`}>{c.last}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ── 2. INDIVIDUAL CHAT PANEL ── */}
      <div className={`flex-1 flex flex-col bg-[#fafbfc] relative min-w-0 ${
        mobileView === "list" ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Chat Header with Mobile Back Button & User Info */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white pr-12">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Back Button */}
            <button
              onClick={() => setMobileView("list")}
              className="md:hidden flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-2.5 py-1.5 rounded-xl shrink-0 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span>Back</span>
            </button>

            <div className="relative shrink-0">
              <img src={convo?.avatar ?? DEFAULT_AVATAR} alt={convo?.name ?? 'User'} className="w-8 h-8 rounded-full object-cover" />
              {convo?.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-[#1A1D2B] truncate">{convo?.name || 'Select conversation'}</p>
              <p className="text-[10px] font-semibold text-green-500">{convo ? (convo.online ? 'Online Now' : 'Offline') : 'No active chat'}</p>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 flex flex-col gap-3">
          <div className="text-center">
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
          </div>
          {messages.map(m => (
            <div key={m.id} className={`flex items-end gap-2 max-w-[85%] sm:max-w-[78%] ${m.me ? "ml-auto flex-row-reverse" : ""}`}>
              {!m.me && <img src={convo?.avatar ?? DEFAULT_AVATAR} alt="" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full mb-1 shrink-0 object-cover" />}
              <div className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm ${m.me ? "rounded-br-none" : "rounded-bl-none"}`}
                style={m.me ? { backgroundColor: "var(--main-orange-color)" } : { backgroundColor: "#f0f4f8" }}>
                <p className={`leading-relaxed ${m.me ? "text-white" : "text-gray-800"}`}>{m.text}</p>
                <span className={`text-[9px] sm:text-[10px] font-semibold block mt-1 ${m.me ? "text-orange-200 text-right" : "text-gray-400"}`}>{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="px-3 sm:px-5 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-2xl px-3 sm:px-4 py-2 border border-gray-100">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="flex-1 min-h-[36px] max-h-24 bg-transparent text-xs sm:text-sm outline-none text-gray-700 resize-none py-1"
              disabled={!convo}
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!convo || sending || !draft.trim()}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: "var(--main-orange-color)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}