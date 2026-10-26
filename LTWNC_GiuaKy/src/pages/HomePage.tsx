import { HomeBanner } from '../components/HomeBanner';
import { BookList } from '../features/books/BookList';
import { BooksGate } from '../features/books/BooksGate';
import { BorrowedPanel } from '../features/books/BorrowedPanel';
import { FilterBar } from '../features/filters/FilterBar';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5">
      <HomeBanner />
      <FilterBar />
      <BooksGate>
        {/* Cột trái: sách đang mượn (dính khi cuộn) · cột phải: danh sách sách */}
        <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-24">
            <BorrowedPanel />
          </div>
          <BookList />
        </div>
      </BooksGate>
    </div>
  );
}
