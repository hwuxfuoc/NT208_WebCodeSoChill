export default function CommunityHeader() {
  return (
    <div className="page-header">
      <h1>Community</h1>
      <div className="search-bar-container">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--main-orange-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Search contest..." />
      </div>
    </div>
  );
}
