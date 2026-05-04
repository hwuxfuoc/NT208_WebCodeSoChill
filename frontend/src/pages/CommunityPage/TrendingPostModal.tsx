import { useState } from "react";

const MOCK_COMMENTS = [
  { id: 1, author: "Alex Code",  avatar: "https://randomuser.me/api/portraits/men/32.jpg",  timeAgo: "1h ago", text: "Great insights! We made the switch last quarter and haven't looked back since." },
  { id: 2, author: "DevGuru",    avatar: "https://randomuser.me/api/portraits/women/68.jpg", timeAgo: "2h ago", text: "Interesting perspective. What about monorepo tooling like Nx or Turborepo though?" },
  { id: 3, author: "Jordan Byte",avatar: "https://randomuser.me/api/portraits/men/22.jpg",  timeAgo: "3h ago", text: "The coordination overhead in polyrepos is real. Teams need mature CI/CD pipelines to handle cross-repo changes gracefully." },
];

interface TrendPost {
  id: number; tag: string; tagColor: string; title: string; pulses: string;
  author: string; role: string; avatar: string; timeAgo: string;
  text: string; likes: number; comments: number;
}

export default function TrendingPostModal({ post, onClose }: { post: TrendPost; onClose: () => void }) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative flex flex-col"
        style={{ maxHeight: "88vh" }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors z-10">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div className="overflow-y-auto flex-1 px-6 pt-6 pb-4" style={{ scrollbarWidth: "thin" }}>
          <div className="mb-5 pb-5 border-b border-gray-100">
            <span className={`text-[10px] font-bold tracking-wider uppercase ${post.tagColor} mb-3 block`}>{post.tag}</span>
            <div className="flex items-center gap-3 mb-4">
              <img src={post.avatar} alt={post.author} className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-gray-800 text-[14px]">{post.author}</h4>
                <span className="text-xs text-gray-500">{post.role} • {post.timeAgo}</span>
              </div>
            </div>
            <h2 className="text-base font-extrabold text-[#1A1D2B] mb-2">{post.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{post.text}</p>

            <div className="flex gap-5 mt-4 text-xs text-gray-400">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(p => !p); }}
                className={`flex items-center gap-1.5 transition-colors ${liked ? "text-orange-500" : "hover:text-orange-500"}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24"
                  fill={liked ? "var(--main-orange-color)" : "none"}
                  stroke={liked ? "var(--main-orange-color)" : "currentColor"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {liked ? post.likes + 1 : post.likes}
              </button>
              <span className="flex items-center gap-1.5 font-bold" style={{ color: "var(--main-orange-color)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                {post.comments} comments
              </span>
              <span className="flex items-center gap-1 ml-auto text-[10px] font-bold" style={{ color: "var(--main-orange-color)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                {post.pulses} pulses today
              </span>
            </div>
          </div>

          <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-3">Comments</p>
          <div className="flex flex-col gap-4 mb-4">
            {MOCK_COMMENTS.map(c => (
              <div key={c.id} className="flex gap-3">
                <img src={c.avatar} alt={c.author} className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5" />
                <div className="bg-gray-50 rounded-2xl px-4 py-3 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[13px] text-gray-800">{c.author}</span>
                    <span className="text-[10px] text-gray-400">{c.timeAgo}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="you" className="w-7 h-7 rounded-full flex-shrink-0" />
            <input className="flex-1 bg-transparent text-sm outline-none text-gray-600" placeholder="Write a comment..." />
            <button className="text-[11px] font-bold px-3 py-1 rounded-full text-white hover:opacity-90" style={{ backgroundColor: "var(--main-orange-color)" }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
