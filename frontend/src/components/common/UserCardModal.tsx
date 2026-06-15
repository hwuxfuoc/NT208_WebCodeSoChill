import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/profileService";
import { useModal } from "../../context/ModalContext";

export type AuthorInfo = {
  _id: string;
  username: string;
  displayname: string;
  avatarUrl: string;
  rank?: string;
  level?: number;
  experiencePoints?: number;
  totalSolved?: number;
};

export default function UserCardModal({ author, currentUser, onClose }: { author: AuthorInfo | null; currentUser: any; onClose: () => void }) {
  const { openModal } = useModal();
  const navigate = useNavigate();
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

  if (!author) return null;

  const displayUser = profileData?.user || author;

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
                src={displayUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayUser.displayname || author.displayname)}`}
                alt={displayUser.displayname || author.displayname}
                className="w-16 h-16 rounded-2xl border-4 border-white object-cover shadow-md"
              />
            </div>

            {/* White content area */}
            <div className="pt-10 px-6 pb-6">
              <p className="font-extrabold text-[17px] text-[#1A1D2B] leading-tight">{displayUser.displayname || author.displayname}</p>
              <p className="text-gray-400 text-sm mb-3">@{displayUser.username || author.username}</p>

              {displayUser.bio && (
                <p className="text-[13px] text-gray-600 mb-4 line-clamp-3">{displayUser.bio}</p>
              )}

              <div className="flex gap-2 mb-4 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-50 text-orange-500">
                  {profileData ? (profileData.leaderboardRank ? `RANK ${profileData.leaderboardRank}` : 'UNRANKED') : '...'}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-blue-500">
                  LV {displayUser.level || 1}
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-green-50 text-green-500">
                  {displayUser.experiencePoints || 0} EXP
                </div>
              </div>

              <div className="mb-5 flex justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[11px] uppercase font-bold tracking-wider">Solved</span>
                  <span className="font-extrabold text-[#1A1D2B]">{displayUser.totalSolved || 0} problems</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-gray-400 text-[11px] uppercase font-bold tracking-wider">Rank Tier</span>
                  <span className="font-extrabold text-[#1A1D2B]">{displayUser.rank || 'Beginner'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {!isSelf && (
                  <button
                    onClick={() => { onClose(); openModal('messages', { action: 'open_chat', user: displayUser }); }}
                    className="flex-1 py-2.5 rounded-xl text-white font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'var(--main-orange-color)' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    Message
                  </button>
                )}
                <button
                  onClick={() => { onClose(); navigate(`/profile/${displayUser.username}`); }}
                  className={`${!isSelf ? "flex-1" : "w-full"} py-2.5 rounded-xl text-gray-700 font-bold text-sm bg-gray-100 hover:bg-gray-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2`}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
