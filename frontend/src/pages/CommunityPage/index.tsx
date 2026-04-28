import { posts } from "../../utils/mockData";

export default function CommunityPage() {
  return (
    <div className="page-stack">
      <h1>Community</h1>
      <div className="community-layout">
        <section className="feed">
          <div className="card"><input className="input" placeholder="What's the architecture today?" /><button className="btn-primary" style={{ marginTop: 10 }}>Post Pulse</button></div>
          {posts.map((post) => (
            <article className="card" key={post.author}>
              <h4>{post.author}</h4>
              <p>{post.text}</p>
              <small>{post.likes} likes · {post.comments} comments</small>
            </article>
          ))}
        </section>

        <aside className="side-stack">
          <div className="card">
            <h3>Trending Pulse</h3>
            <ul>
              <li>The death of mono-repos?</li>
              <li>Next.js 15 Server Actions</li>
              <li>Best mechanical switches 2024</li>
            </ul>
          </div>
          <div className="card">
            <h3>Seasonal Leaderboard</h3>
            <ol>
              <li>Alex Code - 24,500</li>
              <li>SarahZen - 21,320</li>
              <li>Jordan B. - 18,440</li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  );
}
