import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { addExpense } from "../services/expenseService";

export default function AddExpenseModal({
  onClose,
  onSuccess,
  editData,
}: any) {
  const defaultCategories = ["Food", "Travel", "Bills", "Shopping"];

  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [newCategory, setNewCategory] = useState("");

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔁 PREFILL EDIT DATA
  useEffect(() => {
    if (editData) {
      setForm({
        amount: editData.amount || "",
        category: editData.category || "",
        description: editData.description || "",
        date:
          editData.date ||
          new Date().toISOString().split("T")[0],
      });

      // Add category if not in list
      if (
        editData.category &&
        !defaultCategories.includes(editData.category)
      ) {
        setCategories((prev) => [...prev, editData.category]);
      }
    }
  }, [editData]);

  // ✅ VALIDATION
  const validate = () => {
    if (!form.amount) return "Amount is required";
    if (Number(form.amount) <= 0) return "Amount must be greater than 0";
    if (!form.category) return "Category is required";
    return "";
  };

  // ➕ ADD NEW CATEGORY
  const handleAddCategory = () => {
    if (!newCategory) return;

    if (!categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
    }

    setForm({ ...form, category: newCategory });
    setNewCategory("");
  };

  // 🚀 SUBMIT
  const handleSubmit = async () => {
    setError("");

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);

    try {
      if (editData) {
        // ✏️ UPDATE
        await supabase
          .from("expenses")
          .update({
            amount: Number(form.amount),
            category: form.category,
            description: form.description,
            date: form.date,
          })
          .eq("id", editData.id);
      } else {
        // ➕ INSERT
        await addExpense({
          ...form,
          amount: Number(form.amount),
        });
      }

      onSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white dark:bg-slate-800 w-[420px] rounded-2xl p-6 shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold dark:text-white">
            {editData ? "Edit Expense" : "Add New Expense"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:text-white"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Record a new expense to track your spending
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        {/* AMOUNT */}
        <div className="mb-3">
          <label className="text-sm font-medium dark:text-white">
            Amount
          </label>

          <input
            type="number"
            placeholder="0.00"
            className="w-full border p-3 rounded-xl mt-1 dark:bg-slate-700 dark:text-white"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />
        </div>

        {/* CATEGORY */}
        <div className="mb-3">
          <label className="text-sm font-medium dark:text-white">
            Category
          </label>

          <div className="flex gap-2 mt-1">
            <select
              className="w-full border p-3 rounded-xl dark:bg-slate-700 dark:text-white"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <button
              className="border px-3 rounded-xl dark:text-white"
              onClick={handleAddCategory}
            >
              +
            </button>
          </div>

          <input
            placeholder="Add new category"
            className="w-full border p-2 rounded-xl mt-2 dark:bg-slate-700 dark:text-white"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>

        {/* DATE */}
        <div className="mb-3">
          <label className="text-sm font-medium dark:text-white">
            Date
          </label>

          <input
            type="date"
            className="w-full border p-3 rounded-xl mt-1 dark:bg-slate-700 dark:text-white"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="text-sm font-medium dark:text-white">
            Description
          </label>

          <textarea
            placeholder="What did you spend on?"
            className="w-full border p-3 rounded-xl mt-1 dark:bg-slate-700 dark:text-white"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            className="flex-1 bg-indigo-600 text-white p-3 rounded-xl disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : editData
              ? "Update Expense"
              : "Add Expense"}
          </button>

          <button
            className="px-4 border rounded-xl dark:text-white"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}