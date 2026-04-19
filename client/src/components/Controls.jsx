import { useState } from "react";

function Controls({ onRun }) {
  const [errorRate, setErrorRate] = useState(0.2);
  const [delay, setDelay] = useState(500);

  return (
    <div className="card">
      <h3>⚙️ Chaos Controls</h3>

      <div>
        <label>Error Rate: {errorRate}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={errorRate}
          onChange={(e) => setErrorRate(parseFloat(e.target.value))}
        />
      </div>

      <div>
        <label>Delay (ms)</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
        />
      </div>

      <button onClick={() => onRun({ errorRate, delay })}>
        🚀 Run Chaos Test
      </button>
    </div>
  );
}

export default Controls;