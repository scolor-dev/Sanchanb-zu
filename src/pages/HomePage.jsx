// src/pages/HomePage.jsx
import { useMemo, useState, useEffect } from "react";
import { useTodoStore } from "../stores/todoStore";
import TodoModal from "../components/modals/TodoModal";
import { useCharacterStore } from "../stores/characterStore";

// --- 雨のエフェクト用 ---
const RainEffect = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      left: Math.random() * 100 + "vw",
      delay: Math.random() * 2 + "s",
      duration: 0.5 + Math.random() * 0.5 + "s",
    }));
  }, []);

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

// --- ヘルパー関数 ---
function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function HomePage() {
  // --- State ---
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayYYYYMMDD());
  const today = todayYYYYMMDD();
  const [editTarget, setEditTarget] = useState(null);
  
  // 天気管理用のState
  const [weather, setWeather] = useState("Clear");

  const allTodos = useTodoStore((s) => s.todos);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  
  // キャラクターStoreから関数を取得
  const setMoodByWeeklyRate = useCharacterStore((s) => s.setMoodByWeeklyRate);

  const todos = useMemo(() => {
    return allTodos.filter((t) => t.date === date);
  }, [allTodos, date]);

  // -------------------------------------------------------------------
  // 📊 達成率計算ロジック
  // -------------------------------------------------------------------
  useEffect(() => {
    if (allTodos.length === 0) return;

    // 1. 直近7日間のTodoだけを抜き出す
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const weeklyTodos = allTodos.filter((t) => {
      const todoDate = new Date(t.date);
      return todoDate >= oneWeekAgo && todoDate <= now;
    });

    // 2. 今週のTodoがある場合のみ計算
    if (weeklyTodos.length > 0) {
      const completedCount = weeklyTodos.filter((t) => t.isCompleted).length;
      // 達成率 (0〜100)
      const rate = (completedCount / weeklyTodos.length) * 100;
      
      console.log(`今週の達成率: ${rate.toFixed(1)}%`);
      
      // 3. ストアの関数に渡す
      setMoodByWeeklyRate(rate);
    }
  }, [allTodos, setMoodByWeeklyRate]);

  // -------------------------------------------------------------------
  // 🌤️ 天気取得ロジック
  // -------------------------------------------------------------------
  useEffect(() => {
    const IS_TEST_MODE = false; // テスト時はここをtrue

    const fetchWeather = async () => {
      if (IS_TEST_MODE) {
        console.log("🛠️ テストモード: 天気をシミュレーション");
        setTimeout(() => {
          const patterns = ["Clear", "Clouds", "Rain"];
          setWeather(patterns[Math.floor(Math.random() * patterns.length)]);
        }, 500);
        return; 
      }

      // 本番用 (OpenWeatherMap)
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
    
    // もし設定し忘れてた時のためにエラーチェックを入れても良い
    if (!API_KEY) {
       console.error("APIキーが設定されていません");
       return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=Fukuoka&appid=${API_KEY}&units=metric`;
// ...

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data = await res.json();
        const main = data.weather[0].main;

        if (["Rain", "Drizzle", "Thunderstorm"].includes(main)) {
          setWeather("Rain");
        } else if (main === "Clouds") {
          setWeather("Clouds");
        } else {
          setWeather("Clear");
        }
      } catch (error) {
        console.error("❌ 天気取得エラー:", error);
        setWeather("Clear");
      }
    };

    fetchWeather();
  }, []);

  const handleEditClick = (todo) => {
    setEditTarget(todo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTarget(null);
  };

  // 背景色の定義
  const bgClass =
    weather === "Rain" ? "bg-slate-200/80"
    : weather === "Clouds" ? "bg-gray-100"
    : "bg-orange-50/30";

  return (
    <div className={`relative min-h-screen transition-colors duration-1000 ${bgClass}`}>
      
      {/* 天気エフェクトレイヤー */}
      {weather === "Rain" && <RainEffect />}
      {weather === "Clear" && <div className="fixed inset-0 sunny-overlay z-0" />}
      {weather === "Clouds" && <div className="fixed inset-0 cloudy-overlay z-0" />}

      {/* コンテンツエリア */}
      {/* ▼ スマホ(pt-32)とPC(md:pt-24)で余白を変える修正が入った状態 */}
      <div className="relative z-10 space-y-6 p-6 pt-32 md:pt-24">
        
        <div className="flex items-center justify-between">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
                    <div className={`text-sm font-semibold text-slate-900 ${todo.isCompleted ? "line-through text-slate-400" : ""}`}>
                      {todo.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">重要度: {todo.priority}</div>
                  </div>

                  <div className="flex items-center gap-x-3">
                    <button onClick={() => handleEditClick(todo)} className="text-xs text-blue-500 hover:underline">編集</button>
                    <button onClick={() => removeTodo(todo.id)} className="text-xs text-red-500 hover:underline">削除</button>
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
                  <div className={`mt-3 text-sm ${todo.isCompleted ? "text-slate-400" : "text-slate-700"}`}>
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