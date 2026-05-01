export default function BudgetProgress({ spent, limit }: any) {
  const percent = Math.min((spent / limit) * 100, 100);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-sm text-gray-500">Budget Usage</p>

      <div className="mt-2 bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${
            percent > 80 ? "bg-red-500" : "bg-indigo-500"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-sm mt-2">
        ₹{spent} / ₹{limit}
      </p>
    </div>
  );
}