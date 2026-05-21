import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import RightToolbar from "./RightToolbar";
import MobileHeader from "./MobileHeader";
import PageTransition from "../animations/PageTransition";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 900);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when navigating on mobile
  const handleOverlayClick = () => setSidebarOpen(false);

  return (
    <div className="app-shell">
      {/* Mobile sticky header — only visible on mobile */}
      {isMobile && (
        <MobileHeader onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
      )}

      {/* Sidebar overlay backdrop — mobile only */}
      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={handleOverlayClick}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar: normal on desktop, drawer on mobile */}
      <Sidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      <main className="main-content">
        <PageTransition />
      </main>

      <RightToolbar key="right-toolbar-fixed" />
    </div>
  );
}
