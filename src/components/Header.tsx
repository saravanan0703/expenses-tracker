import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
    const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    };
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-xl font-bold">Money Tracker</h1>
        <p className="text-sm text-gray-500">
          Welcome, {user?.email}
        </p>
      </div>

      <div className="flex gap-3">
        <button onClick={toggleDark} className="p-2 border rounded-lg">
          🌙
        </button>
        <button onClick={logout} className="p-2 border rounded-lg">
          ⎋
        </button>
      </div>
    </div>
  );
}