import { useState } from "react";
import { useModal } from "../../context/ModalContext";

const CONVOS = [
  { id: 1, name: "Sarah Chen",  avatar: "https://randomuser.me/api/portraits/women/44.jpg", online: true,  last: "Did you review the PR?",     time: "14:20" },
  { id: 2, name: "Marcus Low",  avatar: "https://randomuser.me/api/portraits/men/32.jpg",   online: false, last: "The build failed on CI.",     time: "Yesterday" },
  { id: 3, name: "Alex Rivera", avatar: "https://randomuser.me/api/portraits/men/55.jpg",   online: false, last: "Lunch at 1? We need to talk...", time: "Tue" },
];

const MSGS = [
  { id: 1, me: false, text: "Hey! I just pushed the new design tokens. Can you check if the coral primary matches the spec?", time: "14:18" },
  { id: 2, me: true,  text: "On it! Looking at the inbox module now. Looks super clean.", time: "14:19" },
  { id: 3, me: false, text: "Awesome! Did you review the PR? We need to merge before the EOD deploy.", time: "14:20" },
];

export default function MessagesModal() {
  const { closeModal } = useModal();
  const [active, setActive] = useState(1);
  const convo = CONVOS.find(c => c.id === active)!;

  return (
    <div className="modal-panel w-[780px] h-[520px] p-0 flex overflow-hidden border-none shadow-2xl">
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
            <input className="bg-transparent text-xs outline-none text-gray-600 flex-1" placeholder="Search..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CONVOS.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-l-4 transition-colors text-left ${active === c.id ? "bg-orange-50/60 border-l-[var(--main-orange-color)]" : "border-l-transparent hover:bg-gray-50"}`}>
              <div className="relative shrink-0">
                <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full" />
                {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-bold text-[#1A1D2B]">{c.name}</span>
                  <span className="text-[10px] text-gray-400">{c.time}</span>
                </div>
                <p className={`text-[11px] truncate ${active === c.id ? "text-orange-500 font-semibold" : "text-gray-400"}`}>{c.last}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#fafbfc] relative">
        <button onClick={closeModal} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 transition-colors z-10">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-white">
          <div className="relative">
            <img src={convo.avatar} alt={convo.name} className="w-8 h-8 rounded-full" />
            {convo.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />}
          </div>
          <div>
            <p className="text-sm font-bold text-[#1A1D2B]">{convo.name}</p>
            <p className="text-[10px] font-semibold text-green-500">{convo.online ? "Online Now" : "Offline"}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
          <div className="text-center">
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
          </div>
          {MSGS.map(m => (
            <div key={m.id} className={`flex items-end gap-2 max-w-[78%] ${m.me ? "ml-auto flex-row-reverse" : ""}`}>
              {!m.me && <img src={convo.avatar} alt="" className="w-7 h-7 rounded-full mb-1 shrink-0" />}
              <div className={`px-4 py-2.5 rounded-2xl ${m.me ? "rounded-br-none" : "rounded-bl-none"}`}
                style={m.me ? { backgroundColor: "var(--main-orange-color)" } : { backgroundColor: "#f0f4f8" }}>
                <p className={`text-sm leading-relaxed ${m.me ? "text-white" : "text-gray-800"}`}>{m.text}</p>
                <span className={`text-[10px] font-semibold block mt-1 ${m.me ? "text-orange-200 text-right" : "text-gray-400"}`}>{m.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
            <input type="text" placeholder="Type a message..." className="flex-1 bg-transparent text-sm outline-none text-gray-700" />
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--main-orange-color)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
