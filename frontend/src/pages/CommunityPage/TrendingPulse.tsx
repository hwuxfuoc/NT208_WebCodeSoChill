import { useState } from "react";
import TrendingPostModal from "./TrendingPostModal";

const TRENDS = [
  { id: 1, tag: "ARCHITECTURE", tagColor: "text-orange-500", title: "The death of Mono-repos?", pulses: "1.2k", author: "Alex Code", role: "Senior Developer", avatar: "https://randomuser.me/api/portraits/men/32.jpg", timeAgo: "3h ago", text: "Mono-repos are dying. The rise of micro-frontends and polyrepo strategies is reshaping how we structure large-scale applications. Teams are moving away from single giant repositories to embrace modular, independently deployable services. Is this the end of the mono-repo era?", likes: 1240, comments: 87 },
  { id: 2, tag: "TECHNOLOGY", tagColor: "text-green-500", title: "Next.js 15 Server Actions", pulses: "856", author: "Sarah Zen", role: "Cloud Architect", avatar: "https://randomuser.me/api/portraits/women/44.jpg", timeAgo: "5h ago", text: "Next.js 15 Server Actions are a game changer for full-stack React development. No more API routes for simple mutations. Your server logic lives right next to your UI components. Here's what changes and why it matters for production apps.", likes: 856, comments: 64 },
  { id: 3, tag: "CHILL CORNER", tagColor: "text-gray-400", title: "Best mechanical switches 2024", pulses: "432", author: "Jordan Byte", role: "Infrastructure Lead", avatar: "https://randomuser.me/api/portraits/men/22.jpg", timeAgo: "8h ago", text: "After testing 40+ switch types this year, here's my definitive 2024 ranking for programmers who code 8+ hours a day. Tactile, linear, or clicky — each has its place depending on your workflow and office situation.", likes: 432, comments: 31 },
  { id: 4, tag: "DEVOPS", tagColor: "text-blue-500", title: "Kubernetes cost optimization tips", pulses: "298", author: "DevGuru", role: "Open Source Pro", avatar: "https://randomuser.me/api/portraits/women/68.jpg", timeAgo: "12h ago", text: "Reduced our K8s bill by 60% in one week using these 5 techniques. Resource requests, node affinity rules, spot instances, and smart HPA configuration can save you thousands monthly without sacrificing reliability.", likes: 298, comments: 22 },
  { id: 5, tag: "OPEN SOURCE", tagColor: "text-purple-500", title: "Building a CLI tool in Rust", pulses: "187", author: "Rustacean V", role: "Systems Engineer", avatar: "https://randomuser.me/api/portraits/men/55.jpg", timeAgo: "1d ago", text: "Rust's CLI ecosystem is mature and blazing fast. Clap for argument parsing, Indicatif for progress bars, Dialoguer for interactive prompts — the DX is excellent. Here's a practical guide to building production-ready CLI tools.", likes: 187, comments: 15 },
];

type Trend = typeof TRENDS[0];

export default function TrendingPulse() {
  const [selected, setSelected] = useState<Trend | null>(null);

  return (
    <>
      <div className="card flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">Trending Pulse</h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--main-orange-color)" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        </div>

        <div className="flex flex-col divide-y divide-gray-100">
          {TRENDS.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setSelected(t)}
              className={`text-left py-3 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors group ${i === 0 ? "pt-0" : ""} ${i === TRENDS.length - 1 ? "pb-0 border-none" : ""}`}
            >
              <span className={`text-[10px] font-bold tracking-wider mb-0.5 block ${t.tagColor}`}>{t.tag}</span>
              <p className="font-semibold text-[13px] text-gray-800 group-hover:text-orange-500 transition-colors leading-snug">{t.title}</p>
              <span className="text-[11px] text-gray-400">{t.pulses} pulses today</span>
            </button>
          ))}
        </div>
      </div>

      {selected && <TrendingPostModal post={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
