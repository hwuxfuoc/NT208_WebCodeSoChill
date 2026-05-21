import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { DEFAULT_AVATAR } from "../../utils/constants";

export default function RightToolbar() {
  const { openModal } = useModal();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarUrl = user?.avatarUrl || DEFAULT_AVATAR;

  if (!user) {
    return (
      <motion.aside
        className="right-toolbar"
        initial={{ x: 60, opacity: 0, filter: "blur(8px)" }}
        animate={{ x: 0,  opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.06 }}
        style={{ willChange: "transform, opacity, filter" }}
      >
        <div className="flex flex-col gap-3 items-center mt-1 w-full">
          <button
            onClick={() => navigate("/login")}
            className="w-[60px] h-[40px] rounded-xl text-white font-bold text-[11px] flex items-center justify-center shadow-md hover:opacity-90 transition-all whitespace-nowrap"
            style={{ backgroundColor: "var(--main-orange-color)" }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-[60px] h-[40px] rounded-xl bg-gray-100 text-gray-700 font-bold text-[11px] flex items-center justify-center hover:bg-gray-200 transition-all whitespace-nowrap"
          >
            Register
          </button>
        </div>
      </motion.aside>
    );
  }

  return (
    <>
      <motion.aside
        className="right-toolbar"
        initial={{ x: 60, opacity: 0, filter: "blur(8px)" }}
        animate={{ x: 0,  opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.06 }}
        style={{ willChange: "transform, opacity, filter" }}
      >
        <button
          className="avt-container overflow-hidden bg-white cursor-pointer"
          onClick={() => setAvatarOpen(true)}
          title="View avatar"
        >
          <img src={avatarUrl} alt="avt" className="object-cover w-full h-full rounded-xl" />
        </button>

        <div className="flex flex-col gap-6 mt-4">
          <button className="tool-btn" onClick={() => openModal("settings")}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
          <button className="tool-btn" onClick={() => openModal("messages")}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </button>
          <button className="tool-btn" onClick={() => openModal("notifications")}>
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
        </div>
      </motion.aside>

      <AnimatePresence>
        {avatarOpen && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setAvatarOpen(false)}
            />
            <div className="modal-host">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative"
                style={{ pointerEvents: "auto" }}
              >
                <button
                  onClick={() => setAvatarOpen(false)}
                  className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors z-10"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                <img
                  src={avatarUrl}
                  alt="avatar full"
                  className="rounded-2xl shadow-2xl object-cover"
                  style={{ maxWidth: "min(480px, 90vw)", maxHeight: "min(480px, 80vh)" }}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
