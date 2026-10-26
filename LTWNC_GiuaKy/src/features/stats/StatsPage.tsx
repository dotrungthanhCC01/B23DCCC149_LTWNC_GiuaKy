import { BookMarked, Briefcase, ChartColumn, Cpu, Languages, type LucideIcon } from 'lucide-react';
import { useAppSelector } from '../../app/hooks';
import { CARD_CLASS, MUTED_TEXT } from '../../components/ui';
import { CATEGORIES, type Category } from '../../types/book';
import { BooksGate } from '../books/BooksGate';
import { MAX_BORROWED_BOOKS } from '../books/borrowLimitMiddleware';
import { selectBooks, selectBorrowedIds, selectCategoryStats } from '../books/booksSlice';

const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  CNTT: Cpu,
  'Kinh tế': Briefcase,
  'Ngoại ngữ': Languages,
};

const percent = (part: number, total: number) => (total === 0 ? 0 : Math.round((part / total) * 100));

function StatsContent() {
  const stats = useAppSelector(selectCategoryStats);
  const totalTitles = useAppSelector(selectBooks).length;
  const borrowedCount = useAppSelector(selectBorrowedIds).length;

  return (
    // Bento 4 cột: ô biểu đồ 2×2 bên trái, 3 ô thể loại + 1 ô đang mượn (nền đen làm điểm nhấn) bên phải
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <section
        aria-label="Số đầu sách theo thể loại"
        className={`${CARD_CLASS} flex flex-col gap-6 p-6 sm:col-span-2 lg:row-span-2`}
      >
        <div>
          <h2 className={`flex items-center gap-2 text-sm font-medium ${MUTED_TEXT}`}>
            <ChartColumn size={18} aria-hidden="true" />
            Số đầu sách theo thể loại
          </h2>
          <p className="mt-2">
            <span className="text-5xl font-bold tabular-nums">{totalTitles}</span>
            <span className={`ml-2 ${MUTED_TEXT}`}>đầu sách</span>
          </p>
        </div>

        <ul className="mt-auto flex flex-col gap-4">
          {CATEGORIES.map((category) => {
            const count = stats[category];
            const pct = percent(count, totalTitles);
            return (
              <li key={category} title={`${category}: ${count} đầu sách (${pct}%)`}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">{category}</span>
                  <span className={`tabular-nums ${MUTED_TEXT}`}>
                    {count} · {pct}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {CATEGORIES.map((category) => {
        const Icon = CATEGORY_ICONS[category];
        return (
          <section key={category} aria-label={category} className={`${CARD_CLASS} flex flex-col justify-between gap-4 p-5`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{category}</span>
              <span className="grid size-9 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Icon size={18} aria-hidden="true" />
              </span>
            </div>
            <p>
              <span className="text-4xl font-bold tabular-nums">{stats[category]}</span>
              <span className={`ml-2 text-sm ${MUTED_TEXT}`}>đầu sách</span>
            </p>
          </section>
        );
      })}

      <section
        aria-label="Sách đang mượn"
        className="flex flex-col justify-between gap-4 rounded-2xl bg-zinc-900 p-5 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">Sách đang mượn</span>
          <span className="grid size-9 place-items-center rounded-lg bg-white/10 dark:bg-zinc-900/10">
            <BookMarked size={18} aria-hidden="true" />
          </span>
        </div>
        <div>
          <p>
            <span className="text-4xl font-bold tabular-nums">{borrowedCount}</span>
            <span className="ml-1 text-lg text-zinc-400 dark:text-zinc-500">/ {MAX_BORROWED_BOOKS} cuốn</span>
          </p>
          <div className="mt-3 flex gap-1.5" aria-hidden="true">
            {Array.from({ length: MAX_BORROWED_BOOKS }, (_, i) => (
              <span
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < borrowedCount ? 'bg-white dark:bg-zinc-900' : 'bg-white/20 dark:bg-zinc-900/20'
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// default export để dùng với React.lazy
export default function StatsPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold tracking-tight">Thống kê</h1>
      <BooksGate>
        <StatsContent />
      </BooksGate>
    </div>
  );
}
