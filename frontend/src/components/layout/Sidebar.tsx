import { NavLink } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/logo.jpg";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Homepage", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
  { to: "/problems", label: "Problems", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg> },
  { to: "/contest", label: "Contest", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> },
  { to: "/community", label: "Community", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
  { to: "/profile", label: "Profile", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> }
];

export default function Sidebar() {
  const authCtx = useContext(AuthContext);
  const isAdmin = !!authCtx?.user?.role && authCtx.user.role === 'admin';
  const adminLink = isAdmin
    ? { to: '/admin/problems', label: 'Admin', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 3h18v18H3z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg> }
    : null;
  const allLinks = adminLink ? [...links, adminLink] : links;
  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -60, opacity: 0, filter: "blur(8px)" }}
      animate={{ x: 0,   opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ willChange: "transform, opacity, filter" }}
    >
      <div className="brand mb-6">
        <div className="flex flex-row items-center">
          <span className="logo mr-2">
            <img src={logo} alt="Logo" className="w-12 h-12 scale-150 origin-center object-contain" />
          </span>
          <span style={{ color: 'var(--text-primary)' }}>CodeSo</span><span style={{ color: 'var(--main-orange-color)' }}>Chill.</span>
        </div>
      </div>
      <div className="side-nav">
        {allLinks.map(({ to, label, icon }) => (
          <div key={to} className="side-item">
            <NavLink to={to} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
              <span className="side-icon flex items-center justify-center w-6">{icon}</span>
              <span className="label">{label}</span>
            </NavLink>
          </div>
        ))}
      </div>

    </motion.aside>
  );
}
