// src/pages/HomePage.jsx
import { useMemo, useState, useEffect } from "react"; //   useEffectを追加
import { useTodoStore } from "../stores/todoStore";
import TodoModal from "../components/modals/TodoModal";

// ---  追加: 雨のエフェクト用 ---
const makeDrops = () =>
  Array.from({ length: 40 }, () => ({
    left: `${Math.random() * 100}vw`,
    delay: `${Math.random() * 2}s`,
    duration: `${0.5 + Math.random() * 0.5}s`,
  }));

const RainEffect = () => {
  // ✅ 初回マウント時にだけ生成して固定（レンダー中に Math.random を呼ばない扱いにできる）
  const [drops] = useState(makeDrops);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {drops.map((style, i) => (
        <div
          key={i}
          className="rain-drop"
          style={{
            left: style.left,
            animationDelay: style.delay,
            animationDuration: style.duration,
          }}
        />
      ))}
    </div>
  );
};

// --- 既存のヘルパー関数 ---
function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function HomePage() {
  // --- 既存のState ---
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayYYYYMMDD());
  const today = todayYYYYMMDD();
  const [editTarget, setEditTarget] = useState(null);

  // --- ✨ 追加: 天気管理用のState ---
  // 初期値は null にしておき、取得できるまでは何もしない（または晴れ扱い）
  const [weather, setWeather] = useState("Clear");

  const allTodos = useTodoStore((s) => s.todos);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);

  const todos = useMemo(() => {
    return allTodos.filter((t) => t.date === date);
  }, [allTodos, date]);

 // -------------------------------------------------------------------
  // 🌤️天気取得ロジック (API と テスト用シミュレーションの両方を含む)
  // -------------------------------------------------------------------
  useEffect(() => {
    //  設定: ここを true にするとAPIを使わずテストモード
    const IS_TEST_MODE = true; 

    const fetchWeather = async () => {
      // -------------------------------------------
      // 【パターンA】 テスト用シミュレーション
      // -------------------------------------------
      if (IS_TEST_MODE) {
        console.log("🛠️ テストモード: 天気をシミュレーションします");
        
        // 0.5秒後にランダムで天気を決定 (またはここで "Rain" 固定などに書き換えてテスト)
        setTimeout(() => {
          const patterns = ["Clear", "Clouds", "Rain"];
          // ランダムに選ぶ
          const randomWeather = patterns[Math.floor(Math.random() * patterns.length)];
          
          console.log(`🎲 テスト結果: ${randomWeather}`);
          setWeather(randomWeather);
        }, 500);
        return; 
      }

      
      // -------------------------------------------
      // 【パターンB】 本番用 (OpenWeatherMap API)
      // -------------------------------------------
      const API_KEY = "12ad352acdd75d4eb6919e18fddd9807";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=Fukuoka&appid=${API_KEY}&units=metric`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();
        const main = data.weather[0].main; // "Clear", "Rain", "Clouds" 等
        console.log("🌍 API取得成功:", main);

        if (["Rain", "Drizzle", "Thunderstorm"].includes(main)) {
          setWeather("Rain");
        } else if (main === "Clouds") {
          setWeather("Clouds");
        } else {
          setWeather("Clear");
        }
      } catch (error) {
        console.error("❌ 天気取得エラー:", error);
        // エラー時はデフォルトで晴れにする
        setWeather("Clear");
      }
    };

    fetchWeather();
  }, []);
  // --- 既存のハンドラ ---
  const handleEditClick = (todo) => {
    setEditTarget(todo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTarget(null);
  };

  // --- ✨ 変更: 背景色を天気によって動的に変える ---
  // 晴れ: bg-orange-50 (暖色系)
  // 雨: bg-slate-200 (暗めの灰色)
  // 曇り: bg-gray-100 (薄い灰色)
  const bgClass =
    weather === "Rain"
      ? "bg-slate-200/80"
      : weather === "Clouds"
      ? "bg-gray-100"
      : "bg-orange-50/30";

  return (
    // ✨ 変更: 全体を包むdivに背景色と min-h-screen (画面いっぱい) を設定
    <div className={`relative min-h-screen transition-colors duration-1000 ${bgClass}`}>
      
      {/* ✨ 追加: 天気エフェクトの表示エリア (背景) */}
      {weather === "Rain" && <RainEffect />}
      {weather === "Clear" && <div className="fixed inset-0 sunny-overlay z-0" />}
      {weather === "Clouds" && <div className="fixed inset-0 cloudy-overlay z-0" />}

      {/* ✨ 変更: コンテンツエリア (z-indexを指定してエフェクトより手前に表示) */}
      <div className="relative z-10 space-y-6 p-6"> {/* p-6を追加して余白確保 */}
        
        {/* --- ここから下は元のコードと同じ --- */}
        <div className="flex items-center justify-between">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            // ✨ 変更: 背景が透けないように少し白を乗せる
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white/80 backdrop-blur-sm"
          />

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 shadow-lg"
          >
            ＋ Todo追加
          </button>
        </div>

        <div className="space-y-3">
          {todos.length === 0 && (
            <div className="text-sm text-slate-500">この日のTodoはありません。</div>
          )}

          {todos.map((todo) => {
            const isPastAndIncomplete = todo.date < today && !todo.isCompleted;

            return (
              <div
                key={todo.id}
                // ✨ 変更: カードの背景も少し透過させてなじませる (bg-white/90など)
                className={[
                  "rounded-2xl border p-4 shadow-sm transition-colors backdrop-blur-sm",
                  isPastAndIncomplete
                    ? "bg-slate-100/90 border-slate-200"
                    : todo.isCompleted
                    ? "bg-green-50/90 border-green-200"
                    : "bg-white/90 border-slate-200",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div
                      className={`text-sm font-semibold text-slate-900 ${
                        todo.isCompleted ? "line-through text-slate-400" : ""
                      }`}
                    >
                      {todo.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      重要度: {todo.priority}
                    </div>
                  </div>

                  <div className="flex items-center gap-x-3">
                    <button
                      onClick={() => handleEditClick(todo)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      編集
                    </button>

                    <button
                      onClick={() => removeTodo(todo.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      削除
                    </button>

                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`rounded-lg px-2 py-1 text-xs font-medium border ${
                        todo.isCompleted
                          ? "border-slate-300 text-slate-500 hover:bg-slate-100"
                          : "border-green-600 text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {todo.isCompleted ? "戻す" : "完了"}
                    </button>
                  </div>
                </div>

                {todo.content && (
                  <div
                    className={`mt-3 text-sm ${
                      todo.isCompleted ? "text-slate-400" : "text-slate-700"
                    }`}
                  >
                    {todo.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <TodoModal
          open={open}
          onClose={handleClose}
          initialDate={date}
          editTarget={editTarget}
        />
      </div>
    </div>
  );
}