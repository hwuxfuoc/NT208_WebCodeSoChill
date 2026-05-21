import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../context/ModalContext";
import { useAuth } from "../../hooks/useAuth";
import { DEFAULT_AVATAR } from "../../utils/constants";
import logo from "../../assets/images/logo.jpg";

interface MobileHeaderProps {
  onMenuToggle: () => void;
}

export default function MobileHeader({ onMenuToggle }: MobileHeaderProps) {
  const { openModal } = useModal();
  const { user } = useAuth();
  const navigate = useNavigate();
  const avatarUrl = user?.avatarUrl || DEFAULT_AVATAR;

  return (
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
        <span style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 18 }}>CodeSo</span>
        <span style={{ color: "var(--main-orange-color)", fontWeight: 700, fontSize: 18 }}>Chill.</span>
      </div>

      {/* Right actions */}
      <div className="mobile-header-actions">
        {user ? (
          <>
            <button className="tool-btn mobile-tool-btn" onClick={() => openModal("notifications")}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <button
              className="avt-container"
              style={{ width: 38, height: 38, marginBottom: 0, padding: 2 }}
              onClick={() => navigate("/profile")}
            >
              <img src={avatarUrl} alt="avatar" className="object-cover w-full h-full rounded-xl" />
            </button>
          </>
        ) : (
          <>
            <button
              className="rounded-xl text-white font-bold text-[11px] px-3 py-2"
              style={{ backgroundColor: "var(--main-orange-color)" }}
              onClick={() => navigate("/login")}
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </header>
  );
}
