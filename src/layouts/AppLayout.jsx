import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

export default function AppLayout() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    cn(
      "block px-3 py-2 text-sm font-medium transition",
      isActive
        ? "text-slate-900"
        : "text-slate-600 hover:text-slate-900"
    );

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
          <div className="text-sm font-semibold">
            さんちゃん坊主
          </div>

          {/* PCナビ */}
          <nav className="hidden sm:flex items-center gap-4">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
          </nav>

          {/* スマホボタン */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden p-2"
            aria-label="menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* スマホメニュー */}
        {open && (
          <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-3">
            <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
              About
            </NavLink>
          </div>
        )}
      </header>

      <main className="w-full px-4 sm:px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
