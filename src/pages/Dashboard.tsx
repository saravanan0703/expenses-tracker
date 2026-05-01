import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseService";
import ExpenseCard from "../components/ExpenseCard";
import Filters from "../components/Filters";
import Chart from "../components/Chart";
import { exportExcel } from "../utils/exportExcel";
import AddExpenseModal from "../components/AddExpenseModal";
import BudgetModal from "../components/BudgetModal";
import BudgetProgress from "../components/BudgetProgress";
import BottomNav from "../components/BottomNav";
import Skeleton from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { getBudget } from "../services/budgetService";

export default function Dashboard() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);

  const [tab, setTab] = useState("expenses");

  const { user, logout } = useAuth();

  const [budget, setBudget] = useState(0);

  // 🔄 LOAD DATA
  const loadExpenses = async () => {
    setLoading(true);

    const { data } = await getExpenses();
    setExpenses(data || []);
    setFiltered(data || []);

    const { data: budgetData } = await getBudget();
    setBudget(budgetData?.monthly_limit || 0);

    setLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
  if (expenses.length === 0) return;

  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);

  handleFilter({
    search: "",
    category: "",
    fromDate: start,
    toDate: today,
  });
}, [expenses]);

  // 🔢 TOTAL (based on filtered)
  const total = filtered.reduce((a, b) => a + Number(b.amount), 0);

  // 🧠 TOP CATEGORY
  const getTopCategory = () => {
    const map: any = {};

    filtered.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });

    const sorted = Object.entries(map).sort((a: any, b: any) => b[1] - a[1]);
    return sorted[0]?.[0] || "N/A";
  };

  // 📅 DATE NORMALIZER (FIXED)
  const normalizeDate = (date: string) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // 🔍 FILTER (FULL FIX)
  const handleFilter = (f: any) => {
    let data = [...expenses];

    if (f.search) {
      data = data.filter((e) =>
        (e.description || "")
          .toLowerCase()
          .includes(f.search.toLowerCase())
      );
    }

    if (f.category) {
      data = data.filter((e) => e.category === f.category);
    }

    if (f.fromDate || f.toDate) {
      const from = f.fromDate ? normalizeDate(f.fromDate) : null;
      const to = f.toDate ? normalizeDate(f.toDate) : null;

      data = data.filter((e) => {
        const d = normalizeDate(e.date);

        if (from && to) return d >= from && d <= to;
        if (from) return d.getTime() === from.getTime(); // exact match
        if (to) return d <= to;

        return true;
      });
    }

    setFiltered(data);
  };

  // 🌙 DARK MODE
  const toggleDark = () => {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0B1220] p-4 pb-24 space-y-4">

      {/* HEADER */}
      <div className="fixed top-0 mb-2 left-0 right-0 z-50 bg-white dark:bg-[#0B1220] border-b dark:border-gray-700">

        <div className="flex justify-between items-center px-4 py-3 max-w-6xl mx-auto">

            {/* LEFT */}
            <div>
            <h1 className="text-lg font-bold dark:text-white">
                Money Tracker
            </h1>
            <p className="text-xs text-gray-500">
                Welcome, {user?.email}
            </p>
            </div>

            {/* RIGHT */}
            <div className="flex gap-2">
            <button
                onClick={toggleDark}
                className="p-2 border rounded-lg dark:text-white"
            >
                🌙
            </button>

            <button
                onClick={logout}
                className="p-2 border rounded-lg dark:text-white"
            >
                ⎋
            </button>
            </div>

        </div>
        </div>
            {/* FILTERS */}
      <Filters onFilter={handleFilter} />

      {/* CARDS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4">
        <Card title="Total Expenses" value={`₹${total}`} color="text-red-500" subtitle={`${filtered.length} transactions`} />
        <Card title="Monthly Budget" value={`₹${budget}`} color="text-blue-500" />
        <Card title="Remaining" value={`₹${budget - total}`} color={(budget - total) < 0 ? "text-red-500" : "text-green-500"} subtitle="Available" />
        <Card title="Top Category" value={getTopCategory()} color="text-purple-500" subtitle="Highest spending" />
      </motion.div>

      {/* ACTIONS */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => setOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl">
          + Add Expense
        </button>

        <button onClick={() => setBudgetOpen(true)} className="border px-4 py-2 rounded-xl dark:border-gray-600">
          ⚙️ Set Budget
        </button>

        <button onClick={() => exportExcel(filtered)} className="border px-4 py-2 rounded-xl dark:border-gray-600">
          ⬇ Export Excel
        </button>
      </div>

      {/* BUDGET */}
      <BudgetProgress spent={total} limit={budget || 1} />


      {/* TABS */}
      <div className="flex bg-gray-100 dark:bg-slate-800 rounded-full p-1">
        <button className={`flex-1 p-2 rounded-full ${tab === "expenses" ? "bg-white dark:bg-slate-700 shadow" : ""}`} onClick={() => setTab("expenses")}>
          Expenses
        </button>

        <button className={`flex-1 p-2 rounded-full ${tab === "charts" ? "bg-white dark:bg-slate-700 shadow" : ""}`} onClick={() => setTab("charts")}>
          Charts
        </button>
      </div>

      {/* CONTENT */}
      {tab === "expenses" ? (
        loading ? (
          <Skeleton />
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No expenses found</p>
            <p className="text-sm">Add your first expense 🚀</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((e) => (
              <ExpenseCard key={e.id} e={e} refresh={loadExpenses} />
            ))}
          </div>
        )
      ) : (
        <Chart data={filtered} />
      )}

      {/* MODALS */}
      {open && <AddExpenseModal onClose={() => setOpen(false)} onSuccess={loadExpenses} />}
      {budgetOpen && <BudgetModal onClose={() => setBudgetOpen(false)} refresh={loadExpenses} />}

      <BottomNav />
    </div>
  );
}

// CARD
function Card({ title, value, subtitle, color }: any) {
  return (
    <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-sm">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
      {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
    </div>
  );
}