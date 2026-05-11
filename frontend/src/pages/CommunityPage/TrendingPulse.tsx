import { useState, useEffect } from "react";
import TrendingPostModal from "./TrendingPostModal";
import { getPosts } from "../../services/communityService";

interface TrendingPost {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  pulses: string;
  author: string;
  role: string;
  avatar: string;
  timeAgo: string;
  text: string;
  likes: number;
  comments: number;
}

const DEFAULT_TRENDS: TrendingPost[] = [
  { id: "1", tag: "ARCHITECTURE", tagColor: "text-orange-500", title: "The death of Mono-repos?", pulses: "1.2k", author: "Alex Code", role: "Senior Developer", avatar: "https://randomuser.me/api/portraits/men/32.jpg", timeAgo: "3h ago", text: "Mono-repos are dying. The rise of micro-frontends and polyrepo strategies is reshaping how we structure large-scale applications. Teams are moving away from single giant repositories to embrace modular, independently deployable services. Is this the end of the mono-repo era?", likes: 1240, comments: 87 },
  { id: "2", tag: "TECHNOLOGY", tagColor: "text-green-500", title: "Next.js 15 Server Actions", pulses: "856", author: "Sarah Zen", role: "Cloud Architect", avatar: "https://randomuser.me/api/portraits/women/44.jpg", timeAgo: "5h ago", text: "Next.js 15 Server Actions are a game changer for full-stack React development. No more API routes for simple mutations. Your server logic lives right next to your UI components. Here's what changes and why it matters for production apps.", likes: 856, comments: 64 },
  { id: "3", tag: "CHILL CORNER", tagColor: "text-gray-400", title: "Best mechanical switches 2024", pulses: "432", author: "Jordan Byte", role: "Infrastructure Lead", avatar: "https://randomuser.me/api/portraits/men/22.jpg", timeAgo: "8h ago", text: "After testing 40+ switch types this year, here's my definitive 2024 ranking for programmers who code 8+ hours a day. Tactile, linear, or clicky — each has its place depending on your workflow and office situation.", likes: 432, comments: 31 },
  { id: "4", tag: "DEVOPS", tagColor: "text-blue-500", title: "Kubernetes cost optimization tips", pulses: "298", author: "DevGuru", role: "Open Source Pro", avatar: "https://randomuser.me/api/portraits/women/68.jpg", timeAgo: "12h ago", text: "Reduced our K8s bill by 60% in one week using these 5 techniques. Resource requests, node affinity rules, spot instances, and smart HPA configuration can save you thousands monthly without sacrificing reliability.", likes: 298, comments: 22 },
  { id: "5", tag: "OPEN SOURCE", tagColor: "text-purple-500", title: "Building a CLI tool in Rust", pulses: "187", author: "Rustacean V", role: "Systems Engineer", avatar: "https://randomuser.me/api/portraits/men/55.jpg", timeAgo: "1d ago", text: "Rust's CLI ecosystem is mature and blazing fast. Clap for argument parsing, Indicatif for progress bars, Dialoguer for interactive prompts — the DX is excellent. Here's a practical guide to building production-ready CLI tools.", likes: 187, comments: 15 },
];

export default function TrendingPulse() {
  const [selected, setSelected] = useState<TrendingPost | null>(null);
  const [trends, setTrends] = useState<TrendingPost[]>(DEFAULT_TRENDS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch top posts and transform them to trending format
    // For now, we'll use default trends as fallback
    fetchTrendingPosts();
  }, []);

  const fetchTrendingPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      
      // Transform backend posts to trending format (sorted by likes)
      const topPosts = (response.data.posts || [])
        .sort((a: any, b: any) => (b.likeCount || 0) - (a.likeCount || 0))
        .slice(0, 5)
        .map((post: any, idx: number) => ({
          id: post._id,
          tag: post.tags?.[0]?.toUpperCase() || ["TRENDING", "POPULAR", "HOT", "BUZZ", "VIRAL"][idx % 5],
          tagColor: ["text-orange-500", "text-green-500", "text-gray-400", "text-blue-500", "text-purple-500"][idx % 5],
          title: post.content.substring(0, 50) + (post.content.length > 50 ? "..." : ""),
          pulses: `${Math.floor((post.likeCount || 0) / 100) || 1}k`,
          author: post.authorId?.displayname || "Anonymous",
          role: post.authorId?.rank || "Community Member",
          avatar: post.authorId?.avatarUrl || "https://randomuser.me/api/portraits/men/1.jpg",
          timeAgo: formatTimeAgo(post.createdAt),
          text: post.content,
          likes: post.likeCount || 0,
          comments: post.commentCount || 0,
        }));

      if (topPosts.length > 0) {
        setTrends(topPosts);
      }
    } catch (err) {
      console.error("Failed to fetch trending posts:", err);
      setTrends(DEFAULT_TRENDS);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <>
      <div className="card flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">Trending Pulse</h3>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--main-orange-color)" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        </div>

        <div className="flex flex-col divide-y divide-gray-100">
          {loading ? (
            <div className="py-8 text-center text-gray-400">
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
            </div>
          ) : trends.length > 0 ? (
            trends.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`text-left py-3 hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors group ${i === 0 ? "pt-0" : ""} ${i === trends.length - 1 ? "pb-0 border-none" : ""}`}
              >
                <span className={`text-[10px] font-bold tracking-wider mb-0.5 block ${t.tagColor}`}>{t.tag}</span>
                <p className="font-semibold text-[13px] text-gray-800 group-hover:text-orange-500 transition-colors leading-snug">{t.title}</p>
                <span className="text-[11px] text-gray-400">{t.pulses} pulses today</span>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-gray-400">
              <p>No trending posts</p>
            </div>
          )}
        </div>
      </div>

      {selected && <TrendingPostModal post={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
