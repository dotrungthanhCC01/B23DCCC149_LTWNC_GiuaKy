import { useCallback, useMemo } from 'react';
import { SearchX } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { CARD_CLASS, MUTED_TEXT } from '../../components/ui';
import { useDebounce } from '../../hooks/useDebounce';
import { useFilterStore } from '../filters/useFilterStore';
import { BookItem } from './BookItem';
import { borrowBook, returnBook, selectBooks, selectBorrowedIds } from './booksSlice';

export const SEARCH_DEBOUNCE_MS = 300;

export function BookList() {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  const borrowedIds = useAppSelector(selectBorrowedIds);

  const keyword = useFilterStore((s) => s.keyword);
  const category = useFilterStore((s) => s.category);
  // Gõ phím chỉ đổi `keyword`; việc lọc chỉ chạy khi ngừng gõ 300ms
  const debouncedKeyword = useDebounce(keyword, SEARCH_DEBOUNCE_MS);

  // useMemo: chỉ lọc lại khi danh sách / từ khoá (đã debounce) / thể loại đổi
  const filteredBooks = useMemo(() => {
    const term = debouncedKeyword.trim().toLowerCase();
    return books.filter((book) => {
      const matchesCategory = category === 'all' || book.category === category;
      const matchesKeyword =
        term === '' || book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term);
      return matchesCategory && matchesKeyword;
    });
  }, [books, debouncedKeyword, category]);

  const borrowedSet = useMemo(() => new Set(borrowedIds), [borrowedIds]);

  // useCallback: giữ nguyên tham chiếu handler để BookItem (React.memo) không render lại thừa
  const handleBorrow = useCallback((id: string) => dispatch(borrowBook(id)), [dispatch]);
  const handleReturn = useCallback((id: string) => dispatch(returnBook(id)), [dispatch]);

  if (filteredBooks.length === 0) {
    return (
      <div className={`${CARD_CLASS} flex flex-col items-center gap-3 px-4 py-16 text-center ${MUTED_TEXT}`}>
        <SearchX size={40} aria-hidden="true" />
        <p>Không tìm thấy sách phù hợp.</p>
      </div>
    );
  }

  return (
    <section aria-label="Danh sách sách" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {filteredBooks.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          isBorrowed={borrowedSet.has(book.id)}
          onBorrow={handleBorrow}
          onReturn={handleReturn}
        />
      ))}
    </section>
  );
}
