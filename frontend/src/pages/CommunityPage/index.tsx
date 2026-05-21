import CreatePostBox from "./CreatePostBox";
import PostFeed from "./PostFeed";
import TrendingPulse from "./TrendingPulse";
import SeasonalLeaderboard from "./SeasonalLeaderboard";
import CommunityHeader from "./CommunityHeader";
import { useAuth } from "../../hooks/useAuth";
import GuestBanner from "../../components/common/GuestBanner";

export default function CommunityPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-stack h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-stack">
        <CommunityHeader />
        <GuestBanner page="community" />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <CommunityHeader />

      <div className="community-layout">
        <section className="feed">
          <CreatePostBox />
          <PostFeed />
        </section>

        <aside className="side-stack">
          <TrendingPulse />
          <SeasonalLeaderboard />
        </aside>
      </div>
    </div>
  );
}
