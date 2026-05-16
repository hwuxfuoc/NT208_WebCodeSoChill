import { useState, useEffect } from "react";
import { getComments, addComment } from "../../services/communityService";
import ImageModal from "./ImageModal";

interface Author {
  _id: string;
  username: string;
  displayname: string;
  avatarUrl: string;
  rank?: string;
}

interface Comment {
  _id: string;
  authorId: Author;
  content: string;
  codeSnippet?: string;
  createdAt: string;
}

interface Post {
  _id: string;
  authorId: Author;
  content: string;
  likeCount: number;
  commentCount: number;
  codeSnippet?: string;
  imageUrl?: string;
  createdAt: string;
}

export default function CommentModal({ 
  post, 
  isLiked,
  onToggleLike,
  onClose 
}: { 
  post: Post; 
  isLiked: boolean;
  onToggleLike: () => void;
  onClose: () => void; 
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [post._id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getComments(post._id);
      setComments(response.data.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await addComment(post._id, { content: newComment });
      setNewComment("");
      fetchComments();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
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
            <div className="flex items-center gap-3 mb-3">
              <img src={post.authorId.avatarUrl} alt={post.authorId.displayname} className="w-9 h-9 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-gray-800 text-[14px]">{post.authorId.displayname}</h4>
                <span className="text-xs text-gray-500">@{post.authorId.username} • {formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{post.content}</p>
            {post.codeSnippet && (
              <div className="mt-3 p-3 bg-gray-900 rounded-xl"><pre className="text-[11px] text-gray-300 font-mono overflow-x-auto">{post.codeSnippet}</pre></div>
            )}
            {post.imageUrl && (
              <div 
                className="mt-3 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setFullScreenImage(post.imageUrl!)}
              >
                <img src={post.imageUrl} alt="post" className="w-full h-48 object-cover opacity-90 hover:opacity-100 transition-opacity" />
              </div>
            )}
            <div className="flex gap-5 mt-4 text-xs text-gray-400">
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike(); }}
                className={`flex items-center gap-1.5 transition-colors ${isLiked ? "text-orange-500" : "hover:text-orange-500"}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {post.likeCount}
              </button>
              <span className="flex items-center gap-1.5 font-bold" style={{ color: "var(--main-orange-color)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                {post.commentCount} comments
              </span>
            </div>
          </div>

          <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-3">Comments</p>
          <div className="flex flex-col gap-4 mb-4">
            {loading ? (
              <div className="py-4 text-center text-gray-400">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
              </div>
            ) : comments.length > 0 ? (
              comments.map(c => (
                <div key={c._id} className="flex gap-3">
                  <img src={c.authorId.avatarUrl} alt={c.authorId.displayname} className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5" />
                  <div className="bg-gray-50 rounded-2xl px-4 py-3 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[13px] text-gray-800">{c.authorId.displayname}</span>
                      <span className="text-[10px] text-gray-400">{formatTimeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{c.content}</p>
                    {c.codeSnippet && (
                      <div className="mt-2 p-2 bg-gray-800 rounded text-[10px] text-gray-200 font-mono overflow-x-auto">
                        {c.codeSnippet}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">No comments yet. Be the first!</p>
            )}
          </div>

          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2.5 border border-gray-100">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="you" className="w-7 h-7 rounded-full flex-shrink-0" />
            <input 
              className="flex-1 bg-transparent text-sm outline-none text-gray-600" 
              placeholder="Write a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <button 
              onClick={handleAddComment}
              disabled={submitting || !newComment.trim()}
              className="text-[11px] font-bold px-3 py-1 rounded-full text-white hover:opacity-90 disabled:opacity-50" 
              style={{ backgroundColor: "var(--main-orange-color)" }}
            >
              {submitting ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
      {fullScreenImage && (
        <ImageModal 
          imageUrl={fullScreenImage} 
          onClose={() => setFullScreenImage(null)} 
        />
      )}
    </div>
  );
}
