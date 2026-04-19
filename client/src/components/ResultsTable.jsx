function ResultsTable({ results }) {
    return (
      <div className="card">
        <h3>📋 Request Results</h3>
  
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", opacity: 0.7 }}>
              <th>Endpoint</th>
              <th>Status</th>
              <th>Result</th>
              <th>Latency</th>
            </tr>
          </thead>
  
          <tbody>
            {results.map((r, i) => (
              <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <td>{r.url}</td>
                <td>{r.status}</td>
                <td style={{ color: r.success ? "#22c55e" : "#ef4444" }}>
                  {r.success ? "Success" : "Failed"}
                </td>
                <td>{r.latency} ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default ResultsTable;