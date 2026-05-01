// import BottomNav from "../components/BottomNav";

export default function AddExpense() {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-xl font-bold mb-4">Add Expense</h1>

      <input className="w-full border p-3 rounded-xl mb-3" placeholder="Amount" />
      <input className="w-full border p-3 rounded-xl mb-3" placeholder="Category" />
      <input className="w-full border p-3 rounded-xl mb-3" placeholder="Description" />

      <button className="w-full bg-indigo-600 text-white p-3 rounded-xl">
        Save
      </button>

      {/* <BottomNav /> */}
    </div>
  );
}