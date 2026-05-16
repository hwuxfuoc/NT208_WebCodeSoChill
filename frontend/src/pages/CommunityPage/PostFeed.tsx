import { useState, useEffect } from "react";
import { getPosts, likePost } from "../../services/communityService";
import CommentModal from "./CommentModal";
import { useAuth } from "../../hooks/useAuth";

interface Post {
  _id: string;
  authorId: {
    _id: string;
    username: string;
    displayname: string;
    avatarUrl: string;
    rank?: string;
  };
  content: string;
  codeSnippet?: string;
  imageUrl?: string;
  likeCount: number;
  likes?: string[];
  commentCount: number;
  tags?: string[];
  createdAt: string;
}

export default function PostFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [commentPost, setCommentPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      const fetchedPosts = response.data.posts;
      setPosts(fetchedPosts);
      
      if (user) {
        const userId = (user as any)._id || user.id;
        const liked = new Set<string>();
        fetchedPosts.forEach((p: Post) => {
          if (p.likes && p.likes.includes(userId)) {
            liked.add(p._id);
          }
        });
        setLikedPosts(liked);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load posts");
      console.error(err);
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

  const toggleLike = async (id: string) => {
    try {
      setLikedPosts(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
      
      await likePost(id);
      // Refresh posts to get updated like count
      fetchPosts();
    } catch (err) {
      console.error("Failed to like post", err);
      setLikedPosts(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center text-red-500">
        <p>{error}</p>
        <button
          onClick={fetchPosts}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="card p-6 text-center text-gray-500">
        <p>No posts yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => {
        const isLiked = likedPosts.has(post._id);
        return (
          <article className="card post-card" key={post._id}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={post.authorId.avatarUrl} alt={post.authorId.displayname} className="post-avatar" />
                <div>
                  <h4 className="font-bold text-gray-800 text-[15px]">{post.authorId.displayname}</h4>
                  <span className="text-xs text-gray-500">@{post.authorId.username} • {formatTimeAgo(post.createdAt)}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
              </button>
            </div>

            <p className="post-content mb-4">{post.content}</p>

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
                onClick={() => toggleLike(post._id)}
                className={`flex items-center gap-2 transition-colors ${isLiked ? "text-orange-500" : "hover:text-orange-500"}`}
              >
                <svg
                  width="18" height="18" viewBox="0 0 24 24"
                  fill={isLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {post.likeCount}
              </button>

              <button
                onClick={() => setCommentPost(post)}
                className="flex items-center gap-2 hover:text-orange-500 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                {post.commentCount}
              </button>
            </div>
          </article>
        );
      })}

      {commentPost && (
        <CommentModal 
          post={commentPost} 
          isLiked={likedPosts.has(commentPost._id)}
          onToggleLike={() => toggleLike(commentPost._id)}
          onClose={() => setCommentPost(null)} 
        />
      )}
    </>
  );
}
