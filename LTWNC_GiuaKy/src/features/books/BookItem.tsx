import { memo } from 'react';
import { BookPlus, CalendarDays, Copy, Undo2, UserRound } from 'lucide-react';
import { BookCover } from '../../components/BookCover';
import { buttonClass, MUTED_TEXT } from '../../components/ui';
import type { Book, Category } from '../../types/book';

export interface BookItemProps {
  book: Readonly<Book>;
  isBorrowed: boolean;
  onBorrow: (id: string) => void;
  onReturn: (id: string) => void;
}

const BOOK_CARD_CLASS =
  'book-card rounded-l-md rounded-r-xl border border-l-16 border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900';

// Màu gáy sách theo thể loại: các sắc độ đen – xám cho hợp tông trắng đen của app
// (Record bắt buộc khai báo đủ 3 thể loại)
const SPINE_COLORS: Record<Category, string> = {
  CNTT: 'border-l-zinc-900 dark:border-l-zinc-100',
  'Kinh tế': 'border-l-zinc-600 dark:border-l-zinc-400',
  'Ngoại ngữ': 'border-l-zinc-400 dark:border-l-zinc-600',
};

function BookItemBase({ book, isBorrowed, onBorrow, onReturn }: BookItemProps) {
  const isOutOfStock = book.available <= 0;

  return (
    <article
      aria-label={book.title}
      // Viền trái dày có màu = gáy sách (nếp gấp vẽ ở .book-card trong index.css); bo góc trái nhỏ như bìa sách thật
      className={`${BOOK_CARD_CLASS} ${SPINE_COLORS[book.category]} group flex flex-col transition-shadow hover:shadow-md ${
        isBorrowed ? 'ring-2 ring-zinc-900 dark:ring-zinc-100' : ''
      }`}
    >
      <div className="relative h-48 overflow-hidden rounded-tr-xl">
        <BookCover
          src={book.coverUrl}
          title={book.title}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur dark:bg-zinc-950/80 dark:text-zinc-100">
          {book.category}
        </span>
        {isBorrowed && (
          <span className="absolute right-3 top-3 rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm dark:bg-white dark:text-zinc-900">
            Đang mượn
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-2 font-semibold leading-snug">{book.title}</h3>

        <ul className={`space-y-1.5 text-sm ${MUTED_TEXT}`}>
          <li className="flex items-center gap-2">
            <UserRound size={15} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{book.author}</span>
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays size={15} className="shrink-0" aria-hidden="true" />
            <span>Năm xuất bản: {book.publishedYear}</span>
          </li>
          <li className="flex items-center gap-2">
            <Copy size={15} className="shrink-0" aria-hidden="true" />
            <span
              className={
                isOutOfStock
                  ? 'font-semibold text-zinc-900 line-through dark:text-zinc-100'
                  : 'font-medium text-zinc-900 dark:text-zinc-100'
              }
            >
              {isOutOfStock ? 'Hết sách' : `Còn ${book.available} bản`}
            </span>
          </li>
        </ul>

        <div className="mt-auto flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => onBorrow(book.id)}
            // Hết bản hoặc đang mượn cuốn này rồi thì không cho mượn tiếp
            disabled={isOutOfStock || isBorrowed}
            title={isOutOfStock ? 'Sách đã hết bản' : isBorrowed ? 'Bạn đang mượn cuốn này' : undefined}
            className={buttonClass('primary', 'md', 'flex-1')}
          >
            <BookPlus size={16} aria-hidden="true" />
            Mượn
          </button>
          {isBorrowed && (
            <button type="button" onClick={() => onReturn(book.id)} className={buttonClass('outline', 'md', 'flex-1')}>
              <Undo2 size={16} aria-hidden="true" />
              Trả
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// React.memo: chỉ render lại cuốn sách có props thay đổi (handler từ cha đã được useCallback)
export const BookItem = memo(BookItemBase);
