export default function BudgetCard({ spent, limit }: any) {
  const percent = (spent / limit) * 100;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-2xl shadow">
      <h2 className="text-lg">Monthly Budget</h2>

      <p className="text-2xl font-bold">₹{spent} / ₹{limit}</p>

      <div className="bg-white/30 rounded-full h-3 mt-2">
        <div
          className="bg-white h-3 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>

      {percent > 80 && (
        <p className="text-sm mt-2">⚠️ Near budget limit</p>
      )}
    </div>
  );
}