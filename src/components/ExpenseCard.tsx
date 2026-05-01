import { useState } from "react";
import { deleteExpense } from "../services/expenseService";
import AddExpenseModal from "./AddExpenseModal";

export default function ExpenseCard({ e, refresh }: any) {
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🗑 DELETE
  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this expense?");
    if (!confirmDelete) return;

    setLoading(true);
    await deleteExpense(e.id);
    setLoading(false);

    refresh(); // reload list
  };

  // 🎨 CATEGORY COLOR (like your UI)
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Bills":
        return "bg-yellow-100 text-yellow-600";
      case "Food":
        return "bg-green-100 text-green-600";
      case "Travel":
        return "bg-blue-100 text-blue-600";
      case "Shopping":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <>
      {/* CARD */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* ICON */}
          <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
            📄
          </div>

          {/* TEXT */}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{e.description || "No description"}</p>

              {/* CATEGORY BADGE */}
              <span
                className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                  e.category
                )}`}
              >
                {e.category}
              </span>
            </div>

            {/* DATE */}
            <p className="text-sm text-gray-500">
              {new Date(e.date).toDateString()}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="text-right">

          {/* AMOUNT */}
          <p className="text-red-500 font-semibold text-lg">
            ₹{Number(e.amount).toFixed(2)}
          </p>

          {/* ACTIONS */}
          <div className="flex gap-3 justify-end mt-1 text-sm">

            {/* EDIT */}
            <button
              onClick={() => setEditOpen(true)}
              className="hover:scale-110 transition"
              title="Edit"
            >
              ✏️
            </button>

            {/* DELETE */}
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-red-500 hover:scale-110 transition"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* ✏️ EDIT MODAL */}
      {editOpen && (
        <AddExpenseModal
          editData={e}
          onClose={() => setEditOpen(false)}
          onSuccess={refresh}
        />
      )}
    </>
  );
}