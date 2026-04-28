import { NavLink } from "react-router-dom";

const links = [
  ["/", "Homepage", "#"],
  ["/problems", "Problems", "[]"],
  ["/contest", "Contest", "()"],
  ["/community", "Community", "@@"],
  ["/profile", "Profile", ":)" ]
] as const;

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">CodeSoChill.</div>
      <nav className="side-nav">
        {links.map(([to, label, icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
            <span className="side-icon">{icon}</span>
            <span className="label">{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="upgrade-card">
        <h4>Upgrade your Account to Pro</h4>
        <p>Unlock premium features and private contests.</p>
        <button className="btn-primary">Upgrade</button>
      </div>
    </aside>
  );
}
