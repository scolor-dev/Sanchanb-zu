// src/pages/HomePage.tsx
import { useMemo, useState } from "react";
import { useTodoStore } from "../stores/todoStore";
import TodoAddModal from "../components/modals/TodoAddModal";

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(todayYYYYMMDD());

  // ✅ “状態”を購読（これが安全）
  const allTodos = useTodoStore((s) => s.todos);
  const removeTodo = useTodoStore((s) => s.removeTodo);

  // ✅ 表示用の派生はコンポーネント側でメモ化
  const todos = useMemo(() => {
    return allTodos.filter((t) => t.date === date);
  }, [allTodos, date]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          ＋ Todo追加
        </button>
      </div>

      <div className="space-y-3">
        {todos.length === 0 && (
          <div className="text-sm text-slate-500">この日のTodoはありません。</div>
        )}

        {todos.map((todo) => (
          <div
            key={todo.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-slate-900">{todo.title}</div>
                <div className="mt-1 text-xs text-slate-500">重要度: {todo.priority}</div>
              </div>

              <button
                onClick={() => removeTodo(todo.id)}
                className="text-xs text-red-500 hover:underline"
              >
                削除
              </button>
            </div>

            {todo.content && (
              <div className="mt-3 text-sm text-slate-700">{todo.content}</div>
            )}
          </div>
        ))}
      </div>

      <TodoAddModal open={open} onClose={() => setOpen(false)} initialDate={date} />
    </div>
  );
}
