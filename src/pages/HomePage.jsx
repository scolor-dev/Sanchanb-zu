export default function Home() {
  return (
    <div className="w-full">
      {/* PC: 左に立ち絵 / 右に本文。スマホ: 縦積み */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        {/* Left: Character */}
        <aside className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">さんちゃん坊主</div>
            <div className="mt-1 text-xs text-slate-500">キャラクター</div>

            {/* 立ち絵（画像を置く） */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {/* 画像が用意できたら src を差し替え
                  public/character.png に置くなら "/character.png"
                  src/assets に置くなら import 方式にする */}
              <img
                src="/character.png"
                alt="character"
                className="h-[520px] w-full object-contain"
                onError={(e) => {
                  // 画像が無い場合のフォールバック（壊れたアイコンを出さない）
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* 画像が無い時に見えるプレースホルダ */}
              <div className="grid h-[520px] w-full place-items-center text-sm text-slate-500">
                立ち絵を /public/character.png に置いてね
              </div>
            </div>

            {/* 小さな補足 */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              PCでは左固定。スマホでは上に表示されます。
            </div>
          </div>
        </aside>

        {/* Right: Content */}
        <section className="min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
            <p className="mt-2 text-sm text-slate-600">
              ここにプロダクトの説明や、機能への導線を置きます。
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-sm font-semibold">今日の状態</div>
                <div className="mt-1 text-sm text-slate-600">
                  例：コンディション、タスク、ログなど
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-sm font-semibold">クイック操作</div>
                <div className="mt-1 text-sm text-slate-600">
                  例：投稿、記録、設定
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                type="button"
                onClick={() => alert("Action")}
              >
                はじめる
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
