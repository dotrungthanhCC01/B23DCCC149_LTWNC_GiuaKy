import type { ReactNode } from 'react';
import { CircleX } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { LoadingState } from '../../components/LoadingState';
import { CARD_CLASS, MUTED_TEXT } from '../../components/ui';
import { selectBooksError, selectBooksStatus } from './booksSlice';

/**
 * Hiển thị loading / lỗi theo trạng thái tải sách; chỉ render `children` khi đã tải xong.
 * Lỗi vừa có toast (Toaster) vừa có khung này để trang không bị trống sau khi toast tắt.
 */
export function BooksGate({ children }: { children: ReactNode }) {
  const status = useAppSelector(selectBooksStatus);
  const error = useAppSelector(selectBooksError);

  if (status === 'idle' || status === 'loading') return <LoadingState />;

  if (status === 'failed') {
    return (
      <div className={`${CARD_CLASS} flex flex-col items-center gap-2 px-4 py-16 text-center`}>
        <CircleX size={40} aria-hidden="true" />
        <p className="font-semibold">Tải dữ liệu thất bại</p>
        <p className={`text-sm ${MUTED_TEXT}`}>{error}</p>
      </div>
    );
  }

  return <>{children}</>;
}
