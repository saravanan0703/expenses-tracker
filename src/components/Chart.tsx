import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function Chart({ data }: any) {
  const grouped: any = {};

  data.forEach((e: any) => {
    grouped[e.category] = (grouped[e.category] || 0) + Number(e.amount);
  });

  const chartData = Object.keys(grouped).map((k) => ({
    name: k,
    value: grouped[k],
  }));

  return (
    <div className="grid md:grid-cols-2 gap-4">

      {/* PIE */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="mb-3 font-semibold">Category Split</h2>
        <PieChart width={300} height={250}>
          <Pie data={chartData} dataKey="value" outerRadius={90}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={["#6366F1", "#22C55E", "#F59E0B", "#EF4444"][i % 4]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* BAR */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="mb-3 font-semibold">Spending</h2>
        <BarChart width={300} height={250} data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>

    </div>
  );
}