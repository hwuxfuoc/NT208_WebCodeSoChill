import { Outlet } from "react-router-dom";

export default function FullscreenLayout() {
  return <main style={{ height: "100vh", overflow: "hidden", background: "#fff" }}><Outlet /></main>;
}

