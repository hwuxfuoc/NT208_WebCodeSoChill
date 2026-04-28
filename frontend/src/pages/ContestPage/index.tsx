export default function ContestPage() {
  return (
    <div className="page-stack">
      <h1>Contest</h1>
      <section className="card">
        <small>LIVE NOW</small>
        <h2>CodeSoChill Biweekly Architectural Challenge #42</h2>
        <p>A high-performance system design challenge.</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="btn-primary">Enter Contest</button>
          <strong>Ends in 01 : 42 : 18</strong>
        </div>
      </section>

      <section className="card">
        <h3>Upcoming Contests</h3>
        <table className="problem-table">
          <thead><tr><th>Name</th><th>Start time</th><th>Duration</th><th>Participants</th><th /></tr></thead>
          <tbody>
            <tr><td>Spring Microservices Sprint</td><td>Oct 24</td><td>2.5 hrs</td><td>4,862</td><td><button>Register</button></td></tr>
            <tr><td>Rust Memory Safety Duel</td><td>Oct 26</td><td>1.5 hrs</td><td>1,129</td><td><button>Register</button></td></tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
