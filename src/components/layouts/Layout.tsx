import { Outlet } from "react-router-dom";
import AppHeader from "./Header";
import CharacterDock from "../character/CharacterDock";
import CharacterFooter from "../character/CharacterFooter";

export default function AppLayout() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <AppHeader />

      {/* スマホ固定フッター分の余白（lg未満のみ） */}
      <main className="w-full px-4 sm:px-6 py-6 pb-28 lg:pb-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <section className="min-w-0">
            <Outlet />
          </section>

          {/* PCのみ：右側キャラクター */}
          <aside className="hidden lg:block">
            <CharacterDock />
          </aside>
        </div>
      </main>

      {/* スマホのみ：下部フッター */}
      <CharacterFooter />
    </div>
  );
}
