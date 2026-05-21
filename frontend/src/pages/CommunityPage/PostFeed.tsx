import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getPosts, likePost } from "../../services/communityService";
import CommentModal from "./CommentModal";
import ImageModal from "./ImageModal";
import { useAuth } from "../../hooks/useAuth";
import { useModal } from "../../context/ModalContext";

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

type AuthorInfo = {
  _id: string;
  username: string;
  displayname: string;
  avatarUrl: string;
  rank?: string;
};

import { getProfile } from "../../services/profileService";


function UserCardModal({ author, currentUser, onClose }: { author: AuthorInfo | null; currentUser: any; onClose: () => void }) {
  const { openModal } = useModal();
  const [profileData, setProfileData] = useState<{ user: any, leaderboardRank: number | null } | null>(null);

  useEffect(() => {
    if (author) {
      getProfile(author.username).then(res => setProfileData(res.data)).catch(console.error);
    } else {
      setProfileData(null);
    }
  }, [author]);

  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    if (!author) return;
    let currentUserId = currentUser?.id || currentUser?._id;
    
    // Fallback: Decode token from localStorage directly
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload && payload.id) currentUserId = payload.id;
      }
    } catch (e) {
      console.error("Token decode error:", e);
    }
    
    const self = Boolean(
      (currentUser && currentUser.username && author.username.toLowerCase() === currentUser.username.toLowerCase()) ||
      (currentUserId && author._id === currentUserId) ||
      (profileData && profileData.user && profileData.user._id === currentUserId)
    );
    setIsSelf(self);
  }, [author, currentUser, profileData]);

  return createPortal(
    <AnimatePresence>
      {author && (
        <motion.div
          className="fixed inset-0 z-[950] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            className="relative bg-white rounded-2xl w-[360px] shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3 }}
          >
            {/* Orange gradient header */}
            <div className="h-28 w-full" style={{ background: 'linear-gradient(135deg, #fdba74, var(--main-orange-color))' }} />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            {/* Avatar floating over the boundary */}
            <div className="absolute left-6" style={{ top: '72px' }}>
              <img
                src={author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.displayname)}`}
                alt={author.displayname}
                className="w-16 h-16 rounded-2xl border-4 border-white object-cover shadow-md"
              />
            </div>

            {/* White content area */}
            <div className="pt-10 px-6 pb-6">
              <p className="font-extrabold text-[17px] text-[#1A1D2B] leading-tight">{author.displayname}</p>
              <p className="text-gray-400 text-sm mb-3">@{author.username}</p>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-50 text-orange-500 mb-4">
                {profileData ? (
                  profileData.leaderboardRank ? `RANK ${profileData.leaderboardRank}` : 'UNRANKED'
                ) : '...'}
              </div>

              {!isSelf && (
                <button
                  onClick={() => { onClose(); openModal('messages'); }}
                  className="w-full py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--main-orange-color)' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Send Message
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function PostFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [commentPost, setCommentPost] = useState<Post | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [viewAuthor, setViewAuthor] = useState<AuthorInfo | null>(null);

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
    // Optimistic update: flip like state and update count in-place without refetching
    const userId = (user as any)?._id || user?.id;
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setPosts(prev => prev.map(p => {
      if (p._id !== id) return p;
      const wasLiked = (p.likes || []).includes(userId);
      return {
        ...p,
        likeCount: wasLiked ? p.likeCount - 1 : p.likeCount + 1,
        likes: wasLiked
          ? (p.likes || []).filter(lid => lid !== userId)
          : [...(p.likes || []), userId],
      };
    }));
    try {
      await likePost(id);
    } catch (err) {
      // Revert on error
      console.error('Failed to like post', err);
      setLikedPosts(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      });
      setPosts(prev => prev.map(p => {
        if (p._id !== id) return p;
        const wasLiked = !(p.likes || []).includes(userId);
        return {
          ...p,
          likeCount: wasLiked ? p.likeCount - 1 : p.likeCount + 1,
        };
      }));
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
                <button
                  onClick={() => setViewAuthor(post.authorId)}
                  className="rounded-xl overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
                >
                  <img src={post.authorId.avatarUrl} alt={post.authorId.displayname} className="post-avatar" />
                </button>
                <div>
                  <button
                    onClick={() => setViewAuthor(post.authorId)}
                    className="font-bold text-gray-800 text-[15px] hover:text-orange-500 transition-colors"
                  >
                    {post.authorId.displayname}
                  </button>
                  <span className="text-xs text-gray-500 block">@{post.authorId.username} • {formatTimeAgo(post.createdAt)}</span>
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
              <div 
                className="mt-4 rounded-xl overflow-hidden border border-gray-100 cursor-pointer"
                onClick={() => setFullScreenImage(post.imageUrl!)}
              >
                <img src={post.imageUrl} alt="post visual" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity" />
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

      {fullScreenImage && (
        <ImageModal 
          imageUrl={fullScreenImage} 
          onClose={() => setFullScreenImage(null)} 
        />
      )}

      <UserCardModal author={viewAuthor} currentUser={user} onClose={() => setViewAuthor(null)} />


    </>
  );
}
