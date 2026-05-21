import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import RightToolbar from "./RightToolbar";
import PageTransition from "../animations/PageTransition";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar key="sidebar-fixed" />
      <main className="main-content">
        <PageTransition />
      </main>
      <RightToolbar key="right-toolbar-fixed" />
    </div>
  );
}
