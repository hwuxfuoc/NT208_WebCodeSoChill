import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../hooks/useAuth";
import { DEFAULT_AVATAR } from "../../utils/constants";
import logo from "../../assets/images/logo.jpg";
import { motion, AnimatePresence } from "framer-motion";

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export default function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  const { openModal } = useModal();
  const { user } = useAuth();
  const navigate = useNavigate();
  const avatarUrl = user?.avatarUrl || DEFAULT_AVATAR;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handler);
    }
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  return (
    <>
      <header className="mobile-header">
        {/* Hamburger button */}
        <button className="mobile-hamburger" onClick={onMenuToggle} aria-label="Toggle sidebar">
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo center */}
        <div className="mobile-header-logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span style={{ fontWeight: 700, fontSize: 18, whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--text-primary)" }}>CodeSo</span><span style={{ color: "var(--main-orange-color)" }}>Chill.</span>
          </span>
        </div>

        {/* Right actions */}
        <div className="mobile-header-actions">
          {user ? (
            <>
              {/* Avatar — click to view full avatar, same as desktop */}
              <button
                className="avt-container"
                style={{ width: 38, height: 38, marginBottom: 0, padding: 2 }}
                onClick={() => setAvatarOpen(true)}
                title="View avatar"
              >
                <img src={avatarUrl} alt="avatar" className="object-cover w-full h-full rounded-xl" />
              </button>

              {/* Dropdown toggle arrow */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="mobile-dropdown-toggle"
                  onClick={() => setDropdownOpen(prev => !prev)}
                  aria-label="Open toolbar menu"
                >
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: "transform 0.2s ease", transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                {/* Dropdown menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      className="mobile-toolbar-dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <button
                        className="mobile-dropdown-item"
                        onClick={() => { setDropdownOpen(false); openModal("notifications"); }}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span>Notifications</span>
                      </button>
                      <button
                        className="mobile-dropdown-item"
                        onClick={() => { setDropdownOpen(false); openModal("messages"); }}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        <span>Messages</span>
                      </button>
                      <button
                        className="mobile-dropdown-item"
                        onClick={() => { setDropdownOpen(false); openModal("settings"); }}
                      >
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        <span>Settings</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <button
                className="rounded-xl font-bold text-[11px] px-3 py-2"
                style={{ backgroundColor: "var(--main-orange-color)", color: "white" }}
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <button
                className="rounded-xl font-bold text-[11px] px-3 py-2"
                style={{ backgroundColor: "#f3f4f6", color: "var(--text-primary)" }}
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* Avatar fullscreen viewer — same as RightToolbar */}
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
              style={{ zIndex: 500 }}
            />
            <div className="modal-host" style={{ zIndex: 510 }}>
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
