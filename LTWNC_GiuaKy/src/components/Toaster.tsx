import { memo, useCallback, useEffect, useState } from 'react';
import { CircleX, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { useAppSelector } from '../app/hooks';
import { selectNotice } from '../features/books/booksSlice';
import type { Notice, NoticeKind } from '../types/notice';

const MAX_VISIBLE = 3;
const AUTO_DISMISS_MS = 4000;

// Toast trắng đen, phân biệt cảnh báo / lỗi bằng icon + nhãn chữ
const KIND_STYLE: Record<NoticeKind, { icon: LucideIcon; label: string }> = {
  warning: { icon: TriangleAlert, label: 'Cảnh báo' },
  error: { icon: CircleX, label: 'Lỗi' },
};

interface ToastItemProps {
  notice: Notice;
  onDismiss: (id: number) => void;
}

const ToastItem = memo(function ToastItem({ notice, onDismiss }: ToastItemProps) {
  const { icon: Icon, label } = KIND_STYLE[notice.kind];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(notice.id), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [notice.id, onDismiss]);

  return (
    <div
      role="alert"
      className="pointer-events-auto flex w-full items-start gap-3 rounded-xl bg-zinc-900 px-4 py-3 text-sm text-white shadow-xl animate-toast-in dark:bg-white dark:text-zinc-900"
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{label}</p>
        <p className="text-zinc-300 dark:text-zinc-600">{notice.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(notice.id)}
        aria-label="Đóng thông báo"
        className="shrink-0 cursor-pointer rounded-md p-1 text-zinc-400 hover:bg-white/10 hover:text-white dark:text-zinc-500 dark:hover:bg-zinc-900/10 dark:hover:text-zinc-900"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
});

/** Hiển thị `notice` mới nhất trong Redux (cảnh báo vượt giới hạn, lỗi API) thành toast. */
export function Toaster() {
  const notice = useAppSelector(selectNotice);
  const [toasts, setToasts] = useState<Notice[]>([]);
  const [lastNoticeId, setLastNoticeId] = useState<number | null>(null);

  // Notice mới (id khác lần trước) → thêm 1 toast ngay trong lúc render
  // (cách React khuyên dùng thay cho setState trong useEffect)
  if (notice && notice.id !== lastNoticeId) {
    setLastNoticeId(notice.id);
    setToasts((prev) => [...prev, notice].slice(-MAX_VISIBLE));
  }

  const dismiss = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} notice={t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
