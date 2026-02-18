// src/pages/HomePage.jsx
import { useMemo, useState, useEffect } from "react";
import { useTodoStore } from "../stores/todoStore";
import TodoModal from "../components/modals/TodoModal";
import { useCharacterStore } from "../stores/characterStore";
import confetti from "canvas-confetti";

import { useWeather, WeatherBackground, bgClassFromWeather } from "../components/weather";

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

  // --- 天気（components/weather に分離） ---
  // 本番にするなら testMode: false にして apiKey 等を設定
  const weather = useWeather({ testMode: true, city: "Fukuoka" });

  const allTodos = useTodoStore((s) => s.todos);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);

  // キャラクターStore（重複宣言は1回だけ）
  const setMoodByWeeklyRate = useCharacterStore((s) => s.setMoodByWeeklyRate);

  const todos = useMemo(() => {
    return allTodos.filter((t) => t.date === date);
  }, [allTodos, date]);

  // -------------------------------------------------------------------
  // 📊 達成率計算ロジック
  // -------------------------------------------------------------------
  useEffect(() => {
    if (allTodos.length === 0) return;

    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const weeklyTodos = allTodos.filter((t) => {
      const todoDate = new Date(t.date);
      return todoDate >= oneWeekAgo && todoDate <= now;
    });

    if (weeklyTodos.length > 0) {
      const completedCount = weeklyTodos.filter((t) => t.isCompleted).length;
      const rate = (completedCount / weeklyTodos.length) * 100;
      setMoodByWeeklyRate(rate);
    }
  }, [allTodos, setMoodByWeeklyRate]);

  // --- ハンドラ ---
  const handleEditClick = (todo) => {
    setEditTarget(todo);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTarget(null);
  };

  // --- 背景色（weatherMap に分離） ---
  const bgClass = bgClassFromWeather(weather);

  return (
    <div className={`relative min-h-screen transition-colors duration-1000 ${bgClass}`}>
      {/* 背景エフェクト（分離側を採用） */}
      <WeatherBackground weather={weather} />

      {/* コンテンツ（手前） */}
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
                  todo.isCompleted
                    ? "bg-green-50/90 border-green-200"
                    : todo.priority === 3
                    ? "bg-red-50/90 border-red-300"
                    : todo.priority === 2
                    ? "bg-yellow-50/90 border-yellow-300"
                    : isPastAndIncomplete
                    ? "bg-slate-100/90 border-slate-200"
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

                    {/* 重要度表示（Api側の要素を復活） */}
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
                      onClick={() => {
                        toggleTodo(todo.id);
                        if (!todo.isCompleted) {
                          confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 },
                          });
                        }
                      }}
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
