import { useState } from "react";
import { posts } from "../../utils/mockData";
import CommentModal from "./CommentModal";

type Post = typeof posts[0];

export default function PostFeed() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [commentPost, setCommentPost] = useState<Post | null>(null);

  const toggleLike = (id: number) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {posts.map((post) => {
        const isLiked = likedPosts.has(post.id);
        return (
          <article className="card post-card" key={post.id}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.author} className="post-avatar" />
                <div>
                  <h4 className="font-bold text-gray-800 text-[15px]">{post.author}</h4>
                  <span className="text-xs text-gray-500">{post.role} • {post.timeAgo}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
              </button>
            </div>

            <p className="post-content mb-4">{post.text}</p>

            {post.codeSnippet && (
              <div className="post-code">
                <pre><code>{post.codeSnippet}</code></pre>
              </div>
            )}
            {post.imageUrl && (
              <div className="mt-4 rounded-xl overflow-hidden border border-gray-100">
                <img src={post.imageUrl} alt="post visual" className="w-full h-auto object-cover opacity-90" />
              </div>
            )}

            <div className="flex gap-6 mt-6 pt-4 border-t border-gray-100 text-sm text-gray-500">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-2 transition-colors ${isLiked ? "text-orange-500" : "hover:text-orange-500"}`}
              >
                <svg
                  width="18" height="18" viewBox="0 0 24 24"
                  fill={isLiked ? "var(--main-orange-color)" : "none"}
                  stroke={isLiked ? "var(--main-orange-color)" : "currentColor"}
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {isLiked ? post.likes + 1 : post.likes}
              </button>

              <button
                onClick={() => setCommentPost(post)}
                className="flex items-center gap-2 hover:text-orange-500 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                {post.comments}
              </button>
            </div>
          </article>
        );
      })}

      {commentPost && (
        <CommentModal 
          post={commentPost} 
          isLiked={likedPosts.has(commentPost.id)}
          onToggleLike={() => toggleLike(commentPost.id)}
          onClose={() => setCommentPost(null)} 
        />
      )}
    </>
  );
}
