import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-7xl font-bold text-slate-900">404</div>

      <div className="mt-4 text-xl font-semibold text-slate-800">
        ページが見つかりません
      </div>

      <div className="mt-2 text-sm text-slate-500">
        URLが間違っているか、ページが削除された可能性があります。
      </div>

      <Link
        to="/"
        className="mt-6 rounded-xl bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        ホームへ戻る
      </Link>
    </div>
  );
}
