function Metrics({ summary }) {
    return (
    <div style = {{display: "flex", gap: "20px"}}>
      <div className="card" style={{ flex: 1 }}>
        <h4> Success Rate </h4>
        <h2 style={{color: "#22c55e"}}>
        <p> Success: {summary.successRate.toFixed(2)}%</p>
        </h2>
        </div>
        <div className="card" style={{ flex: 1 }}>
        <h4> Failure Rate</h4>
        <h2 style={{ color: "#ef4444" }}>
          {(100 - summary.successRate).toFixed(2)}%
        </h2>
      </div>

      <div className="card" style={{ flex: 1 }}>
        <h4> Avg Latency</h4>
        <h2 style={{ color: "#38bdf8" }}>
          {summary.avgLatency} ms
        </h2>
      </div>
      </div>
    );
  }
  
  export default Metrics;