import { NavLink, Outlet } from "react-router-dom";

export default function AppLayout() {
  const linkBase =
    "rounded-md px-3 py-2 text-sm font-medium transition";
  const linkActive =
    "bg-slate-900 text-white";
  const linkInactive =
    "text-slate-700 hover:bg-slate-100 hover:text-slate-900";

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">
              S
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Sanchanb-zu</div>
              <div className="text-xs text-slate-500">header + layout</div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              About
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>

      {/* Footer（要らなければ消してOK） */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-500">
          © {new Date().getFullYear()} Sanchanb-zu
        </div>
      </footer>
    </div>
  );
}
