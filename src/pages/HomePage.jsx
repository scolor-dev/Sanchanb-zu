// src/pages/HomePage.jsx
import { useMemo, useState } from "react";
import { useTodoStore } from "../stores/todoStore";
import TodoModal from "../components/modals/TodoModal";
import {
  useWeather,
  WeatherBackground,
  bgClassFromWeather,
} from "../components/weather";

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

  // --- 天気（components/weather に分離） ---
  // testMode: true の間は 0.5秒後に Clear/Clouds/Rain をランダム
  // 本番にするなら testMode: false にして apiKey を設定
  const weather = useWeather({ testMode: true, city: "Fukuoka" });

  const allTodos = useTodoStore((s) => s.todos);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);

  const todos = useMemo(() => {
    return allTodos.filter((t) => t.date === date);
  }, [allTodos, date]);

  // --- 既存のハンドラ ---
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
    <div
      className={`relative min-h-screen transition-colors duration-1000 ${bgClass}`}
    >
      {/* 背景エフェクト */}
      <WeatherBackground weather={weather} />

      {/* コンテンツ（手前） */}
      <div className="relative z-10 space-y-6 p-6">
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
