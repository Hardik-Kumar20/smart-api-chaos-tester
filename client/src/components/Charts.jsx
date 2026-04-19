import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

function Charts({ results }) {
    const latencyData = results.map((r, i) => ({
        name: i,
        latency: r.latency,

    }));

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    const pieData = [
        { name: "Success", value: successCount },
        { name: "Failure", value: failureCount }
    ];

    return (
        <div className="card">
          <h3>📈 Analytics</h3>
          <div style={{display: "flex", gap: "40px"}}>
          <LineChart width={400} height={250} data={latencyData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="latency" />
          </LineChart>



          <PieChart width={250} height={250}>
            <Pie
             data={pieData}
             dataKey="value"
             outerRadius={80}
            >
                <Cell fill="#22c55e"/>
                <Cell fill="#ef4444"/>
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        </div>
      );
}

export default Charts;