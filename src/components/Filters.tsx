import { useState, useEffect, useRef } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function Filters({ onFilter }: any) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const pickerRef = useRef<any>(null);

    const getDefaultRange = () => {
  const today = new Date();

  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(0, 0, 0, 0);

  return [
    {
      startDate: start,
      endDate: end,
      key: "selection",
    },
  ];
};

  const [range, setRange] = useState<any>(getDefaultRange());

  // ✅ APPLY FILTER
  const applyFilters = () => {
    onFilter({
      search,
      category,
      fromDate: range[0]?.startDate,
      toDate: range[0]?.endDate,
    });

    setShowPicker(false);
  };



  // ✅ CLICK OUTSIDE CLOSE
  useEffect(() => {
     onFilter({
    search: "",
    category: "",
    fromDate: range[0].startDate,
    toDate: range[0].endDate,
  });
    const handleClickOutside = (event: any) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white dark:bg-[#111827] border dark:border-gray-700 p-4 rounded-xl" style={{ marginTop: 60 }}>

      <h2 className="font-semibold mb-3 dark:text-white">Filters</h2>

      {/* SINGLE ROW */}
      <div className="flex flex-wrap items-center gap-3">

        {/* SEARCH */}
        <input
          placeholder="🔍 Search..."
          className="flex-1 min-w-[180px] border p-2 rounded-lg dark:bg-slate-700 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* CATEGORY */}
        <select
          className="min-w-[160px] border p-2 rounded-lg dark:bg-slate-700 dark:text-white"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Bills">Bills</option>
          <option value="Shopping">Shopping</option>
        </select>

        {/* DATE PICKER */}
        <div className="relative" ref={pickerRef}>

          <button
            onClick={() => setShowPicker((prev) => !prev)}
            className="min-w-[220px] border p-2 rounded-lg text-left dark:text-white bg-white dark:bg-slate-700"
          >
            📅 {range[0]?.startDate && range[0]?.endDate
              ? `${range[0].startDate.toLocaleDateString()} → ${range[0].endDate.toLocaleDateString()}`
              : "Select dates"}
          </button>

          {/* DROPDOWN CALENDAR */}
          {showPicker && (
            <div className="absolute z-50 mt-2 w-[320px] bg-white dark:bg-[#111827] border dark:border-gray-700 rounded-xl shadow-lg">

              <DateRange
                editableDateInputs
                onChange={(item: any) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={range}
              />

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 p-3 border-t dark:border-gray-700">
                <button
                  onClick={() => setShowPicker(false)}
                  className="px-3 py-1 border rounded-lg dark:text-white"
                >
                  Close
                </button>

                <button
                  onClick={applyFilters}
                  className="px-3 py-1 bg-indigo-600 text-white rounded-lg"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* APPLY BUTTON */}
        <button
          onClick={applyFilters}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Apply
        </button>
      </div>
    </div>
  );
}