import CreatePostBox from "./CreatePostBox";
import PostFeed from "./PostFeed";
import TrendingPulse from "./TrendingPulse";
import SeasonalLeaderboard from "./SeasonalLeaderboard";
import CommunityHeader from "./CommunityHeader";

export default function CommunityPage() {
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
