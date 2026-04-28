import type { RouteObject } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import FullscreenLayout from "./components/layout/FullscreenLayout";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import ContestPage from "./pages/ContestPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "problems", element: <ProblemsPage /> },
      { path: "contest", element: <ContestPage /> },
      { path: "community", element: <CommunityPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "profile/:username", element: <ProfilePage /> }
    ]
  },
  {
    path: "/problems/:id",
    element: <FullscreenLayout />,
    children: [{ index: true, element: <ProblemDetailPage /> }]
  },
  { path: "/login", element: <LoginPage /> },
  { path: "*", element: <NotFoundPage /> }
];

export default routes;
