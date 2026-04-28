import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RightToolbar from "./RightToolbar";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content"><Outlet /></main>
      <RightToolbar />
    </div>
  );
}
