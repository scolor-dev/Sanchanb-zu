import { NavLink, Outlet } from "react-router-dom";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function AppLayout() {
  const linkClass = ({ isActive }) =>
    cn(
      "px-3 py-2 text-sm font-medium transition",
      isActive ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
    );

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="flex h-14 w-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold">さんちゃん坊主</div>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </nav>
        </div>
      </header>

      {/* ページはそのまま貼り付け（Outlet） */}
      <main className="w-full px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
