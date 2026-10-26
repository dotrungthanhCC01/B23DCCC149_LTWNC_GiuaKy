import { memo, useCallback } from 'react';
import { BookMarked, Undo2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { BookCover } from '../../components/BookCover';
import { buttonClass, CARD_CLASS, MUTED_TEXT } from '../../components/ui';
import { returnBook, selectBorrowedBooks } from './booksSlice';
import { MAX_BORROWED_BOOKS } from './borrowLimitMiddleware';

/** Khung "giỏ" sách đang mượn: ảnh, thông tin và nút Trả của từng cuốn. */
export const BorrowedPanel = memo(function BorrowedPanel() {
  const dispatch = useAppDispatch();
  const borrowedBooks = useAppSelector(selectBorrowedBooks);

  const handleReturn = useCallback((id: string) => dispatch(returnBook(id)), [dispatch]);

  return (
    <aside aria-label="Sách đang mượn" className={`${CARD_CLASS} flex flex-col gap-4 p-4`}>
      <h2 className="flex items-center gap-2 font-semibold">
        <BookMarked size={18} aria-hidden="true" />
        Sách đang mượn
        <span className="ml-auto rounded-full bg-zinc-900 px-2 py-0.5 text-xs font-semibold tabular-nums text-white dark:bg-zinc-100 dark:text-zinc-900">
          {borrowedBooks.length}/{MAX_BORROWED_BOOKS}
        </span>
      </h2>

      {/* Thanh hạn mức: mỗi ô là 1 lượt mượn */}
      <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
        {Array.from({ length: MAX_BORROWED_BOOKS }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full ${
              i < borrowedBooks.length ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {borrowedBooks.length === 0 ? (
        <p className={`py-6 text-center text-sm ${MUTED_TEXT}`}>
          Chưa mượn cuốn nào.
          <br />
          Mỗi sinh viên được mượn tối đa {MAX_BORROWED_BOOKS} cuốn.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {borrowedBooks.map((book) => (
            <li key={book.id} className="flex gap-3 rounded-xl border border-zinc-200 p-2 dark:border-zinc-800">
              <BookCover src={book.coverUrl} title={book.title} className="h-20 w-16 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="line-clamp-2 text-sm font-semibold leading-snug">{book.title}</p>
                <p className={`truncate text-xs ${MUTED_TEXT}`}>{book.author}</p>
                <p className={`text-xs ${MUTED_TEXT}`}>
                  {book.category} · {book.publishedYear}
                </p>
                <button
                  type="button"
                  onClick={() => handleReturn(book.id)}
                  aria-label={`Trả ${book.title}`}
                  className={buttonClass('outline', 'sm', 'mt-auto self-start')}
                >
                  <Undo2 size={14} aria-hidden="true" />
                  Trả
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
});
