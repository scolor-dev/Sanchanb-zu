import { useState } from "react";
import { NavLink } from "react-router-dom";

function cn(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function AppHeader() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "block px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "text-slate-900 dark:text-white"
        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
    );

  return (
    <header className="
      sticky top-0 z-50 border-b
      border-slate-200 dark:border-slate-700
      bg-white/90 dark:bg-slate-900/90
      backdrop-blur supports-[backdrop-filter]:bg-white/70
      dark:supports-[backdrop-filter]:bg-slate-900/70
    ">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
        <div className="text-sm font-semibold text-slate-900 dark:text-white">
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
          className="sm:hidden p-2 text-slate-700 dark:text-slate-300"
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
        <div className="
          sm:hidden border-t
          border-slate-200 dark:border-slate-700
          bg-white dark:bg-slate-900
          px-4 py-3
        ">
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
            About
          </NavLink>
        </div>
      )}
    </header>
  );
}
