export default function Home() {
  return (
    <div className="w-full">
      {/* PC: 左本文 / 右立ち絵 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        
        {/* Left: Content */}
        <section className="min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Home
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              ここにプロダクトの説明や、機能への導線を置きます。
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-sm font-semibold">今日の状態</div>
                <div className="mt-1 text-sm text-slate-600">
                  コンディション、タスク、ログなど
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-sm font-semibold">クイック操作</div>
                <div className="mt-1 text-sm text-slate-600">
                  投稿、記録、設定など
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                type="button"
              >
                はじめる
              </button>
            </div>
          </div>
        </section>

        {/* Right: Character */}
        <aside className="lg:sticky lg:top-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-sm font-semibold text-slate-900">
              さんちゃん坊主
            </div>
            <div className="mt-1 text-xs text-slate-500">
              キャラクター
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src="/character.png"
                alt="character"
                className="h-[520px] w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {/* 画像が無いとき用 */}
              <div className="grid h-[520px] w-full place-items-center text-sm text-slate-500">
                /public/character.png に画像を置いてください
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
              PCでは右固定。スクロール時は追従します。
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
