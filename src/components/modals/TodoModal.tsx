// src/components/modals/TodoAddModal.tsx　編集部分は時間あったら新しいファイルに
import { useEffect, useMemo, useState } from "react";
// ✨ 変更: TodoItem 型をインポートに追加
import { useTodoStore, type TodoItem } from "../../stores/todoStore";

type Priority = 1 | 2 | 3;

type Props = {
  open: boolean;
  onClose: () => void;
  initialDate?: string; // YYYY-MM-DD
  // ✨ 追加: 編集対象を受け取る (nullなら新規作成モード)
  editTarget?: TodoItem | null;
};

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ✨ 引数に editTarget を追加
export default function TodoAddModal({ open, onClose, initialDate, editTarget }: Props) {
  const addTodo = useTodoStore((s) => s.addTodo);
  // ✨ 追加: 更新用のアクションを取得
  const updateTodo = useTodoStore((s) => s.updateTodo);

  const defaultDate = useMemo(() => initialDate ?? todayYYYYMMDD(), [initialDate]);

  const [date, setDate] = useState(defaultDate);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Priority>(2);

  // ✨ 変更: open または editTarget が変わった時に初期値をセット
  useEffect(() => {
    if (!open) return;

    if (editTarget) {
      // 編集モード：既存のデータを入れる
      setDate(editTarget.date);
      setTitle(editTarget.title);
      setContent(editTarget.content);
      setPriority(editTarget.priority);
    } else {
      // 新規作成モード：リセット
      setDate(defaultDate);
      setTitle("");
      setContent("");
      setPriority(2);
    }
  }, [open, defaultDate, editTarget]);

  // Escで閉じる
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const canSave = title.trim().length > 0;

  // ✨ 変更: 保存処理を分岐
  const submit = () => {
    if (!canSave) return;

    if (editTarget) {
      // 編集モード：更新を実行
      updateTodo(editTarget.id, {
        date,
        title: title.trim(),
        content: content.trim(),
        priority,
      });
    } else {
      // 新規モード：追加を実行
      addTodo({
        date,
        title: title.trim(),
        content: content.trim(),
        priority,
      });
    }
    onClose();
  };

  if (!open) return null;

  // ✨ 文言の切り替え用変数
  const isEdit = !!editTarget;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* ✨ 文言変更 */}
              <div className="text-lg font-semibold text-slate-900">
                {isEdit ? "Todoを編集" : "Todoを追加"}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {isEdit ? "内容を更新します" : "日付・重要度・内容を登録します"}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
              aria-label="close"
            >
              ✕
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {/* 日付 */}
            <div>
              <label className="block text-sm font-medium text-slate-700">日付</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                タイトル
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：レポートを書く"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
              {!canSave && (
                <div className="mt-1 text-xs text-slate-500">タイトルは必須です</div>
              )}
            </div>

            {/* 内容 */}
            <div>
              <label className="block text-sm font-medium text-slate-700">内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="詳細（任意）"
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            {/* 重要度 */}
            <div>
              <label className="block text-sm font-medium text-slate-700">重要度</label>
              <div className="mt-2 flex gap-2">
                {([1, 2, 3] as Priority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={[
                      "rounded-xl px-3 py-2 text-sm font-medium transition",
                      priority === p
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="mt-1 text-xs text-slate-500">1=低 / 2=中 / 3=高</div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!canSave}
              className={[
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                canSave
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed",
              ].join(" ")}
            >
              {/* ✨ 文言変更 */}
              {isEdit ? "更新" : "追加"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
