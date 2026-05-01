import { useState } from "react";
import { setBudget } from "../services/budgetService";

export default function BudgetModal({ onClose, refresh }: any) {
  const [amount, setAmount] = useState("");

  const save = async () => {
    await setBudget(Number(amount));
    refresh();
    onClose(); // ✅ important
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={onClose} // ✅ click outside closes
    >
      <div
        className="bg-white p-6 rounded-xl w-[300px]"
        onClick={(e) => e.stopPropagation()} // ✅ prevent closing inside
      >
        <h2 className="font-bold mb-3">Set Budget</h2>

        <input
          className="w-full border p-3 rounded-xl mb-3"
          onChange={(e) => setAmount(e.target.value)}
        />

        <button
          className="bg-indigo-600 text-white w-full p-3 rounded-xl"
          onClick={save}
        >
          Save
        </button>

        <button
          className="mt-2 w-full border p-2 rounded-xl"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}