import { useState } from "react";
import Navbar from "./components/Navbar";
import Controls from "./components/Controls";
import Metrics from "./components/Metrics";
import Charts from "./components/Charts";
import ResultsTable from "./components/ResultsTable";
import "./style.css";

function App() {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async (config) => {
    const res = await fetch("http://localhost:5000/api/test/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        endpoints: [
          { method: "GET", url: "/users" },
          { method: "GET", url: "/posts" },
          { method: "GET", url: "/comments" }
        ],
        chaosConfig: config
      })
    });

    setLoading(true);

    const data = await res.json();

    setResults(data.results);
    setSummary(data.summary);
  };

  return (
    <>
      <Navbar />
      <div className="container">
  <Controls onRun={runTest} />

    {loading && (
    <div className="card">
      <p>⏳ Running chaos simulation...</p>
    </div>
  )}

  {summary && (
    <>
      <Metrics summary={summary} />
      <Charts results={results} />
    </>
  )}

  {results.length > 0 && <ResultsTable results={results} />}
</div>
    </>
  );
}

export default App;