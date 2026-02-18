export default function ToastItem({ toast, onClose }) {
  const base =
    "min-w-[220px] rounded-xl px-4 py-3 shadow-lg text-sm backdrop-blur-md border transition";

  const typeStyle =
    toast.type === "success"
      ? "bg-green-50 border-green-200 text-green-800"
      : toast.type === "error"
      ? "bg-red-50 border-red-200 text-red-800"
      : toast.type === "warning"
      ? "bg-yellow-50 border-yellow-200 text-yellow-800"
      : "bg-white border-slate-200 text-slate-800";

  return (
    <div className={`${base} ${typeStyle}`}>
      <div className="flex justify-between items-start gap-3">
        <div>{toast.message}</div>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
