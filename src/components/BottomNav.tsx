import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3">
      <Link to="/" className={pathname === "/" ? "text-indigo-600" : ""}>
        🏠
      </Link>
      <Link to="/add" className={pathname === "/add" ? "text-indigo-600" : ""}>
        ➕
      </Link>
    </div>
  );
}