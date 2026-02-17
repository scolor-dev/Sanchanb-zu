// src/pages/HomePage.jsx
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
//  追加: 過去かどうか判定するために「今日の日付」を持っておく
  const today = todayYYYYMMDD();
  //  修正: .jsxなので <any> などの型定義を削除
  // 編集対象のTodoを管理するState (初期値は null)
  const [editTarget, setEditTarget] = useState(null);

  // ✅ “状態”を購読
  const allTodos = useTodoStore((s) => s.todos);
  const removeTodo = useTodoStore((s) => s.removeTodo);
//  追加: 完了状態を切り替える関数を取ってくる
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  // ✅ 表示用の派生はコンポーネント側でメモ化
  const todos = useMemo(() => {
    return allTodos.filter((t) => t.date === date);
  }, [allTodos, date]);

  // ✨ 追加: 編集ボタンを押した時の処理
  // 引数の型定義 (todo: any) も削除
  const handleEditClick = (todo) => {
    setEditTarget(todo); // 編集対象をセット
    setOpen(true);       // モーダルを開く
  };

  // ✨ 追加: モーダルを閉じる時の処理
  const handleClose = () => {
    setOpen(false);
    setEditTarget(null); // 閉じる時に編集対象をリセット
  };

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

        {todos.map((todo) => {
          // ✨ 追加: 「過去の日付」かつ「未完了」かどうかの判定
          const isPastAndIncomplete = todo.date < today && !todo.isCompleted;

          return (
            <div
              key={todo.id}
              // ✨ 変更: 条件に応じて背景色を変える
              className={[
                "rounded-2xl border p-4 shadow-sm transition-colors",
                isPastAndIncomplete
                  ? "bg-slate-100 border-slate-200" // 過去＆未完了 → 灰色
                  : todo.isCompleted
                  ? "bg-green-50 border-green-200"  // 完了済み → 薄緑
                  : "bg-white border-slate-200",    // 通常 → 白
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div>
                  {/* ✨ 変更: 完了済みなら打ち消し線(line-through)を入れる */}
                  <div className={`text-sm font-semibold text-slate-900 ${todo.isCompleted ? "line-through text-slate-400" : ""}`}>
                    {todo.title}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">重要度: {todo.priority}</div>
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
                  
                  {/* ✨ 追加: 完了ボタン */}
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`rounded-lg px-2 py-1 text-xs font-medium border ${
                      todo.isCompleted
                        ? "border-slate-300 text-slate-500 hover:bg-slate-100" // 「戻す」のデザイン
                        : "border-green-600 text-green-600 hover:bg-green-50" // 「完了」のデザイン
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

      {/* ✨ 修正: editTarget をモーダルに渡す */}
      <TodoAddModal 
        open={open} 
        onClose={handleClose} 
        initialDate={date} 
        editTarget={editTarget} 
      />
    </div>
  );
}