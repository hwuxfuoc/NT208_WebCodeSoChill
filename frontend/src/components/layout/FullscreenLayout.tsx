import { Outlet } from "react-router-dom";

export default function FullscreenLayout() {
  return <main style={{ minHeight: "100vh", padding: 16, background: "#f8fafc" }}><Outlet /></main>;
}
